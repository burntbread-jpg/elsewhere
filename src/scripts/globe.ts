import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
type Pin={id:string;label:string;lat:number;lng:number;image:string;href:string;title:string};
type Land={features:{geometry:{type:string;coordinates:number[][][]|number[][][][]}}[]};

const position=(lat:number,lng:number,r=1)=>new THREE.Vector3(r*Math.cos(lat*Math.PI/180)*Math.cos(lng*Math.PI/180),r*Math.sin(lat*Math.PI/180),-r*Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180));
const easeOut=(t:number)=>1-Math.pow(1-t,3);

// Living paper globe: an intro move, idle spin that resumes after interaction, an olive atmosphere rim,
// pulsing pins, journey arcs drawn in travel order with a comet, and a slight lean toward the cursor.
// Reduced motion turns off the spin, intro, pulses, comets and lean; the globe stays fully usable.
export async function initGlobe(root:HTMLElement){
 const stage=root.querySelector<HTMLElement>('.globe-stage')!;const status=document.querySelector<HTMLElement>('[data-globe-status]')!;
 const pins:Pin[]=JSON.parse(root.dataset.pins||'[]');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);stage.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const controls=new OrbitControls(camera,renderer.domElement);Object.assign(controls,{enablePan:false,enableDamping:true,dampingFactor:.07,minDistance:1.55,maxDistance:5.2,enableZoom:false,rotateSpeed:.55,minPolarAngle:.12,maxPolarAngle:Math.PI-.12,autoRotate:!reduced,autoRotateSpeed:.45});controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;
 const initial=position(24,95,3.65);
 // Intro: start far and a third of a turn away, then settle on the home view.
 camera.position.copy(reduced?initial:position(8,-10,7.5));controls.update();
 let target:THREE.Vector3|undefined=reduced?undefined:initial.clone();let targetDistance=initial.length();

 // The land texture is drawn from vector outlines. Phones get 4096×2048 (iOS Safari caps a canvas at about
 // 16.7 million pixels); larger screens with a mouse get 8192×4096 where the GPU allows it.
 const wide=renderer.capabilities.maxTextureSize>=8192&&!matchMedia('(pointer: coarse)').matches;
 const TW=wide?8192:4096,TH=TW/2;
 const textureCanvas=document.createElement('canvas');textureCanvas.width=TW;textureCanvas.height=TH;const ctx=textureCanvas.getContext('2d')!;
 function drawLand(land:Land){ctx.fillStyle='#e2e6df';ctx.fillRect(0,0,TW,TH);ctx.fillStyle='#8c9a80';ctx.strokeStyle='#f4f2e8';ctx.lineWidth=.7*TW/2048;ctx.lineJoin='round';
  for(const feature of land.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates as number[][][]]:feature.geometry.coordinates as number[][][][];for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach(([lng,lat],i)=>{const x=(lng+180)/360*TW;const y=(90-lat)/180*TH;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();}ctx.fill('evenodd');ctx.stroke();}}}
 // Draw the light 1:110m outline first so the globe appears quickly, then swap in the 1:50m coastline.
 const response=await fetch('/maps/land.geojson');if(!response.ok)throw Error('Map data unavailable');drawLand(await response.json());
 const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
 fetch('/maps/land-50m.geojson').then(r=>r.ok?r.json():undefined).then((detail?:Land)=>{if(!detail)return;drawLand(detail);texture.needsUpdate=true;}).catch(()=>{});
 // Everything on the surface lives in one group so the cursor lean moves it together.
 const world=new THREE.Group();scene.add(world);
 const globe=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0}));world.add(globe);
 scene.add(new THREE.AmbientLight(0xffffff,1.9));const sun=new THREE.DirectionalLight(0xfff8e8,2.6);sun.position.set(-3,4,5);camera.add(sun);scene.add(camera);
 const gridMaterial=new THREE.LineBasicMaterial({color:0x66735f,transparent:true,opacity:.13});
 for(let lat=-60;lat<=60;lat+=30){const pts=Array.from({length:181},(_,i)=>position(lat,i*2-180,1.002));world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),gridMaterial));}
 for(let lng=-180;lng<180;lng+=30){const pts=Array.from({length:91},(_,i)=>position(i*2-90,lng,1.002));world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),gridMaterial));}
 // Atmosphere: a back-faced shell whose rim brightens toward the silhouette.
 scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.07,64,48),new THREE.ShaderMaterial({uniforms:{color:{value:new THREE.Color(0x7d8b73)}},
  vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform vec3 color;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),4.);gl_FragColor=vec4(color,f*.68);}',
  side:THREE.BackSide,transparent:true,depthWrite:false})));
 // Pins: a dot and a ring that pulses outward on the surface.
 // Each ring is drawn by a shader on a square that grows across the surface, with the line itself kept a
 // fixed number of screen pixels wide. A scaled ring mesh would thicken as it spreads and as the camera zooms in.
 const ringGeometry=new THREE.PlaneGeometry(2,2);const ringLinePx=1.6*renderer.getPixelRatio();
 const ringVertex='varying vec2 vUv;void main(){vUv=uv*2.-1.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
 const ringFragment='uniform vec3 color;uniform float opacity;uniform float linePx;varying vec2 vUv;void main(){float d=length(vUv);float aa=fwidth(d);float c=1.-(linePx*.5+1.)*aa;float a=clamp(1.-(abs(d-c)-linePx*.5*aa)/aa,0.,1.);if(a<=0.)discard;gl_FragColor=vec4(color,a*opacity);}';const dotGeometry=new THREE.CircleGeometry(.009,24);const dotMaterial=new THREE.MeshBasicMaterial({color:0x4f594c,side:THREE.DoubleSide});
 const rings=pins.map((pin,i)=>{const p=position(pin.lat,pin.lng,1.006);const material=new THREE.ShaderMaterial({uniforms:{color:{value:new THREE.Color(0x4f594c)},opacity:{value:0},linePx:{value:ringLinePx}},vertexShader:ringVertex,fragmentShader:ringFragment,transparent:true,side:THREE.DoubleSide,depthWrite:false});const ring=new THREE.Mesh(ringGeometry,material);const dot=new THREE.Mesh(dotGeometry,dotMaterial);for(const m of [ring,dot]){m.position.copy(p);m.lookAt(p.clone().multiplyScalar(2));world.add(m);}return{ring,material,phase:i*.33};});
 // Journey arcs in travel order (oldest first), drawn one after another; a comet runs along each once drawn.
 const order=[...pins].reverse();const arcMaterial=new THREE.LineBasicMaterial({color:0x4f594c,transparent:true,opacity:.75});const cometGeometry=new THREE.SphereGeometry(.009,16,12);const cometMaterial=new THREE.MeshBasicMaterial({color:0x4f594c});
 const arcs=order.slice(1).map((pin,i)=>{const a=position(order[i].lat,order[i].lng),b=position(pin.lat,pin.lng);const height=.12+a.angleTo(b)*.18,n=160;
  const points=Array.from({length:n+1},(_,k)=>{const t=k/n;return a.clone().lerp(b,t).normalize().multiplyScalar(1.004+Math.sin(Math.PI*t)*height);});
  const geometry=new THREE.BufferGeometry().setFromPoints(points);geometry.setDrawRange(0,0);world.add(new THREE.Line(geometry,arcMaterial));
  const comet=new THREE.Mesh(cometGeometry,cometMaterial);comet.visible=false;world.add(comet);return{geometry,points,comet,n,drawn:0};});
 const arcStart=performance.now()+(reduced?0:1400);

 const markerRoot=root.querySelector<HTMLElement>('.globe-markers')!;
 const markers=pins.map(pin=>{const button=document.createElement('button');button.className='globe-photo-pin';button.setAttribute('aria-label',`${pin.label} 사진 위치 확대`);const img=document.createElement('img');img.src=pin.image;img.alt='';button.append(img);const label=document.createElement('span');label.textContent=pin.label;button.append(label);markerRoot.append(button);return{pin,button,local:position(pin.lat,pin.lng,1.025)};});
 let active='';let idleTimer=0;let dragging=false;let downX=0;let downY=0;let manipulating=false;
 const pause=()=>{controls.autoRotate=false;clearTimeout(idleTimer);};
 const resumeLater=()=>{clearTimeout(idleTimer);if(reduced)return;idleTimer=window.setTimeout(()=>{if(!active)controls.autoRotate=true;},5000);};
 function focus(point:THREE.Vector3,pin?:Pin){pause();target=point.clone().normalize().multiplyScalar(2.35);targetDistance=2.35;active=pin?.id||'';status.textContent=pin?`${pin.label} · 사진을 다시 누르면 여행기가 열립니다.`:'선택한 지역을 확대했습니다. 드래그하면 주변을 둘러볼 수 있습니다.';markers.forEach(m=>m.button.classList.toggle('is-active',m.pin.id===active));}
 function selectPin(pin:Pin){if(active===pin.id){location.href=pin.href;return;}focus(position(pin.lat,pin.lng),pin);}
 markers.forEach(m=>m.button.addEventListener('click',()=>selectPin(m.pin)));
 document.querySelectorAll<HTMLButtonElement>('[data-globe-pin]').forEach(b=>b.addEventListener('click',()=>{const pin=pins.find(p=>p.id===b.dataset.globePin);if(pin)focus(position(pin.lat,pin.lng),pin);}));
 function reset(){target=initial.clone();targetDistance=initial.length();active='';status.textContent='지구본에서 마음이 가는 곳을 골라 보세요.';markers.forEach(m=>m.button.classList.remove('is-active'));resumeLater();}
 root.querySelector('[data-globe-reset]')!.addEventListener('click',reset);
 root.querySelectorAll<HTMLButtonElement>('[data-globe-zoom]').forEach(b=>b.addEventListener('click',()=>{pause();target=undefined;targetDistance=THREE.MathUtils.clamp(camera.position.length()*(b.dataset.globeZoom==='in'?.78:1.28),1.55,5.2);resumeLater();}));
 controls.addEventListener('start',()=>{manipulating=true;pause();target=undefined;targetDistance=camera.position.length();});
 controls.addEventListener('end',()=>{manipulating=false;targetDistance=camera.position.length();resumeLater();});
 renderer.domElement.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;dragging=false;});
 renderer.domElement.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)dragging=true;});
 const raycaster=new THREE.Raycaster();
 renderer.domElement.addEventListener('pointerup',e=>{if(dragging)return;const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObject(globe)[0];if(hit)focus(hit.point);});
 // Pinch zoom is enabled only during a two-finger gesture; ordinary page scrolling stays outside the globe.
 renderer.domElement.addEventListener('touchstart',e=>{controls.enableZoom=e.touches.length>1;},{passive:true});
 // Cursor lean: the globe tips slightly toward the pointer on devices that hover.
 const lean={x:0,y:0};
 if(!reduced&&matchMedia('(hover: hover)').matches)stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();lean.x=((e.clientY-r.top)/r.height-.5)*.16;lean.y=((e.clientX-r.left)/r.width-.5)*.22;});
 stage.addEventListener('pointerleave',()=>{lean.x=0;lean.y=0;});
 const resize=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(stage);
 let visible=true;const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(stage);
 root.querySelector<HTMLElement>('.globe-fallback')!.hidden=true;root.dataset.ready='true';
 const projected=new THREE.Vector3();const direction=new THREE.Vector3();const worldPos=new THREE.Vector3();const clock=new THREE.Clock();
 renderer.setAnimationLoop(()=>{if(!visible||document.hidden)return;
  const t=clock.getElapsedTime(),now=performance.now();
  // Travel around the globe, not through it: ease the direction and the distance separately.
  if(target){const k=reduced?1:.055;const d=THREE.MathUtils.lerp(camera.position.length(),target.length(),k);camera.position.normalize().lerp(target.clone().normalize(),k).normalize().multiplyScalar(d);if(camera.position.distanceTo(target)<.003){camera.position.copy(target);target=undefined;}}
  else if(!manipulating){const distance=camera.position.length();if(Math.abs(targetDistance-distance)>.002)camera.position.multiplyScalar(THREE.MathUtils.lerp(distance,targetDistance,reduced?1:.12)/distance);}
  world.rotation.x+=(lean.x-world.rotation.x)*.06;world.rotation.y+=(lean.y-world.rotation.y)*.06;
  rings.forEach(r=>{const p=reduced?.4:((t*.55+r.phase)%1);r.ring.scale.setScalar(.024*(1+easeOut(p)*2.4));r.material.uniforms.opacity.value=(1-p)*.85;});
  arcs.forEach((a,i)=>{const want=now>arcStart+i*900?a.n+1:0;a.drawn=reduced?want:a.drawn+(want-a.drawn)*.06;a.geometry.setDrawRange(0,Math.round(a.drawn));a.comet.visible=!reduced&&a.drawn>a.n-1;if(a.comet.visible)a.comet.position.copy(a.points[Math.floor(((t*.25+i*.37)%1)*a.n)]);});
  // Drag and auto-rotation turn the globe by an angle, so close up the same swipe would sweep the surface
  // several times faster. Scale both by the camera's height above the surface relative to the opening view.
  {const near=THREE.MathUtils.clamp((camera.position.length()-1)/(initial.length()-1),.1,1);controls.rotateSpeed=.55*near;controls.autoRotateSpeed=.45*near;}
  controls.update();renderer.render(scene,camera);direction.copy(camera.position).normalize();
  const screenMarkers=markers.map(m=>{worldPos.copy(m.local).applyMatrix4(world.matrixWorld);const front=worldPos.clone().normalize().dot(direction)>1/camera.position.length();projected.copy(worldPos).project(camera);return{...m,x:(projected.x*.5+.5)*stage.clientWidth,y:(-projected.y*.5+.5)*stage.clientHeight,visible:front&&Math.abs(projected.x)<.96&&Math.abs(projected.y)<.93};});
  // Photo cards that sit almost on top of each other are nudged apart, sideways or upward, by the least
  // distance that keeps each one visible. Each push follows the direction from one pin to the other, so cards keep the pins'
  // arrangement and stay as close to their places as the space allows.
  // Cards may overlap by up to about 40% so the map stays readable as stories pile up; no card strays
  // more than about half a card from its pin.
  const shown=screenMarkers.filter(m=>m.visible);const cw=shown[0]?.button.offsetWidth||60,ch=shown[0]?.button.offsetHeight||48;const w=cw*.6,h=ch*.6,reach=cw*.55;
  const pos=shown.map(m=>({x:m.x,y:m.y}));
  for(let it=0;it<24;it++){let moved=false;
   for(let a=0;a<shown.length;a++)for(let b=a+1;b<shown.length;b++){
    const ox=w-Math.abs(pos[a].x-pos[b].x),oy=h-Math.abs(pos[a].y-pos[b].y);if(ox<=0||oy<=0)continue;moved=true;
    const px=shown[b].x-shown[a].x,py=shown[b].y-shown[a].y;
    if(ox/w<=oy/h||Math.abs(px)/w>=Math.abs(py)/h){const s=(px||b-a)>0?1:-1;pos[a].x-=s*ox/2;pos[b].x+=s*ox/2;}
    else{const s=(py||b-a)>0?1:-1;pos[a].y-=s*oy/2;pos[b].y+=s*oy/2;}}
   if(!moved)break;}
  pos.forEach((p,k)=>{const dx=p.x-shown[k].x,dy=p.y-shown[k].y,d=Math.hypot(dx,dy);if(d>reach){p.x=shown[k].x+dx*reach/d;p.y=shown[k].y+dy*reach/d;}});
  const placed=new Map(shown.map((m,k)=>[m,pos[k]]));
  screenMarkers.forEach(m=>{m.button.hidden=!m.visible;if(!m.visible)return;const p=placed.get(m)!;const dx=Math.round(p.x-m.x),dy=Math.round(p.y-m.y);m.button.style.setProperty('--pin-offset',`${dx}px`);m.button.style.setProperty('--pin-offset-y',`${dy}px`);m.button.style.left=`${p.x}px`;m.button.style.top=`${p.y}px`;});
 });
 const cleanup=()=>{renderer.setAnimationLoop(null);clearTimeout(idleTimer);resize.disconnect();observer.disconnect();controls.dispose();texture.dispose();renderer.dispose();scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Line){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(m=>m.dispose());}});};window.addEventListener('pagehide',cleanup,{once:true});
}
