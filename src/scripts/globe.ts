import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
type Pin={id:string;label:string;lat:number;lng:number;image:string;href:string;title:string};
type Land={features:{geometry:{type:string;coordinates:number[][][]|number[][][][]}}[]};
export async function initGlobe(root:HTMLElement){
 const stage=root.querySelector<HTMLElement>('.globe-stage')!;const status=document.querySelector<HTMLElement>('[data-globe-status]')!;
 const pins:Pin[]=JSON.parse(root.dataset.pins||'[]');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,1,.1,100);const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);stage.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=1.35;controls.maxDistance=5.2;controls.enableZoom=false;controls.rotateSpeed=.55;controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI-.12;
 const position=(lat:number,lng:number,r=1)=>new THREE.Vector3(r*Math.cos(lat*Math.PI/180)*Math.cos(lng*Math.PI/180),r*Math.sin(lat*Math.PI/180),-r*Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180));
 const initial=position(24,95,3.65);camera.position.copy(initial);controls.update();
 const textureCanvas=document.createElement('canvas');textureCanvas.width=2048;textureCanvas.height=1024;const ctx=textureCanvas.getContext('2d')!;
 ctx.fillStyle='#e2e6df';ctx.fillRect(0,0,2048,1024);
 const response=await fetch('/maps/land.geojson');if(!response.ok)throw Error('Map data unavailable');const land:Land=await response.json();
 ctx.fillStyle='#8c9a80';ctx.strokeStyle='#f4f2e8';ctx.lineWidth=.7;
 for(const feature of land.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates as number[][][]]:feature.geometry.coordinates as number[][][][];for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach(([lng,lat],i)=>{const x=(lng+180)/360*2048;const y=(90-lat)/180*1024;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();}ctx.fill('evenodd');ctx.stroke();}}
 // Longitude at sphere +X is 0°; Three's UV starts at -X (−180°).
 const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
 const globe=new THREE.Mesh(new THREE.SphereGeometry(1,96,64),new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0}));scene.add(globe);
 scene.add(new THREE.AmbientLight(0xffffff,2.1));const sun=new THREE.DirectionalLight(0xfff8e8,2.4);sun.position.set(-3,5,4);scene.add(sun);
 const gridMaterial=new THREE.LineBasicMaterial({color:0x66735f,transparent:true,opacity:.15});
 for(let lat=-60;lat<=60;lat+=30){const pts=Array.from({length:181},(_,i)=>position(lat,i*2-180,1.002));scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),gridMaterial));}
 for(let lng=-180;lng<180;lng+=30){const pts=Array.from({length:91},(_,i)=>position(i*2-90,lng,1.002));scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),gridMaterial));}
 const markerRoot=root.querySelector<HTMLElement>('.globe-markers')!;
 const markers=pins.map(pin=>{const button=document.createElement('button');button.className='globe-photo-pin';button.setAttribute('aria-label',`${pin.label} 사진 위치 확대`);const img=document.createElement('img');img.src=pin.image;img.alt='';button.append(img);const label=document.createElement('span');label.textContent=pin.label;button.append(label);markerRoot.append(button);return{pin,button,world:position(pin.lat,pin.lng,1.025)};});
 let target:THREE.Vector3|undefined;let active='';let dragging=false;let downX=0;let downY=0;let distance=camera.position.length();let targetDistance=distance;
 function focus(point:THREE.Vector3,pin?:Pin){controls.autoRotate=false;target=point.clone().normalize().multiplyScalar(1.65);targetDistance=1.65;active=pin?.id||'';status.textContent=pin?`${pin.label} · 사진을 다시 누르면 여행기가 열립니다.`:'선택한 지역을 확대했습니다. 드래그하면 주변을 둘러볼 수 있습니다.';markers.forEach(m=>m.button.classList.toggle('is-active',m.pin.id===active));}
 function selectPin(pin:Pin){if(active===pin.id){location.href=pin.href;return;}focus(position(pin.lat,pin.lng),pin);}
 markers.forEach(m=>m.button.addEventListener('click',()=>selectPin(m.pin)));
 document.querySelectorAll<HTMLButtonElement>('[data-globe-pin]').forEach(b=>b.addEventListener('click',()=>{const pin=pins.find(p=>p.id===b.dataset.globePin);if(pin)focus(position(pin.lat,pin.lng),pin);}));
 function reset(){target=initial.clone();targetDistance=initial.length();active='';status.textContent='지구본에서 마음이 가는 곳을 골라 보세요.';markers.forEach(m=>m.button.classList.remove('is-active'));}
 root.querySelector('[data-globe-reset]')!.addEventListener('click',reset);
 root.querySelectorAll<HTMLButtonElement>('[data-globe-zoom]').forEach(b=>b.addEventListener('click',()=>{target=undefined;targetDistance=THREE.MathUtils.clamp(camera.position.length()*(b.dataset.globeZoom==='in'?.78:1.28),1.35,5.2);}));
 let manipulating=false;
 controls.addEventListener('start',()=>{manipulating=true;target=undefined;targetDistance=camera.position.length();});
 controls.addEventListener('end',()=>{manipulating=false;targetDistance=camera.position.length();});
 renderer.domElement.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;dragging=false;});
 renderer.domElement.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)dragging=true;});
 const raycaster=new THREE.Raycaster();
 renderer.domElement.addEventListener('pointerup',e=>{if(dragging)return;const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObject(globe)[0];if(hit)focus(hit.point);});
 // Pinch zoom is enabled only during a two-finger gesture; ordinary page scrolling stays outside the globe.
 renderer.domElement.addEventListener('touchstart',e=>{controls.enableZoom=e.touches.length>1;},{passive:true});
 const resize=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(stage);
 let visible=true;const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(stage);
 root.querySelector<HTMLElement>('.globe-fallback')!.hidden=true;root.dataset.ready='true';
 const projected=new THREE.Vector3();const direction=new THREE.Vector3();
 renderer.setAnimationLoop(()=>{if(!visible||document.hidden)return;
  if(target){camera.position.lerp(target,reduced?1:.09);if(camera.position.distanceTo(target)<.002){camera.position.copy(target);target=undefined;}}
  else if(!manipulating){distance=camera.position.length();if(Math.abs(targetDistance-distance)>.002)camera.position.multiplyScalar(THREE.MathUtils.lerp(distance,targetDistance,reduced?1:.12)/distance);}
  controls.update();renderer.render(scene,camera);direction.copy(camera.position).normalize();
  const screenMarkers=markers.map(m=>{const front=m.world.dot(direction)>1/camera.position.length();projected.copy(m.world).project(camera);return{...m,x:(projected.x*.5+.5)*stage.clientWidth,y:(-projected.y*.5+.5)*stage.clientHeight,visible:front&&Math.abs(projected.x)<.96&&Math.abs(projected.y)<.93};});
  screenMarkers.forEach((m,index)=>{m.button.hidden=!m.visible;if(!m.visible)return;const crowded=screenMarkers.some((other,j)=>j!==index&&other.visible&&Math.hypot(m.x-other.x,m.y-other.y)<90);const offset=crowded?(index%2?40:-40):0;m.button.style.setProperty('--pin-offset',`${offset}px`);m.button.style.left=`${m.x+offset}px`;m.button.style.top=`${m.y}px`;});
 });
 const cleanup=()=>{renderer.setAnimationLoop(null);resize.disconnect();observer.disconnect();controls.dispose();texture.dispose();renderer.dispose();scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Line){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(m=>m.dispose());}});};window.addEventListener('pagehide',cleanup,{once:true});
}
