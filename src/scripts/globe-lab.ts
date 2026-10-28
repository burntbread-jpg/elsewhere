import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Globe motion study. One engine, three looks:
//  g1 — living paper globe: idle spin, intro, olive atmosphere, pulsing pins, journey arcs drawn in order.
//  g2 — night dot globe: land as a field of dots on a dark ocean, stars, light beams and travelling comets.
//  g3 — scroll story: the globe holds still beside chapters and flies to each journey as its chapter arrives.
export type Variant = 'g1'|'g2'|'g3';
type Pin = { id:string; label:string; lat:number; lng:number; image:string; href:string; title:string };
type Land = { features:{ geometry:{ type:string; coordinates:number[][][]|number[][][][] } }[] };

const LOOKS = {
 g1:{ ocean:'#e2e6df', land:'#8c9a80', coast:'#f4f2e8', atmosphere:0x7d8b73, atmosphereStrength:.75, arc:0x4f594c, ring:0x4f594c, dots:false, stars:false, beams:false, spin:.45 },
 g2:{ ocean:'#1d211d', land:'#c9d2bf', coast:'#1d211d', atmosphere:0x9fb4a0, atmosphereStrength:1.1, arc:0xe9e2c9, ring:0xe9e2c9, dots:true, stars:true, beams:true, spin:.6 },
 g3:{ ocean:'#e2e6df', land:'#8c9a80', coast:'#f4f2e8', atmosphere:0x7d8b73, atmosphereStrength:.6, arc:0x4f594c, ring:0x4f594c, dots:false, stars:false, beams:false, spin:.25 },
} as const;

const position = (lat:number, lng:number, r = 1) => new THREE.Vector3(
 r*Math.cos(lat*Math.PI/180)*Math.cos(lng*Math.PI/180),
 r*Math.sin(lat*Math.PI/180),
 -r*Math.cos(lat*Math.PI/180)*Math.sin(lng*Math.PI/180));
const easeOut = (t:number) => 1 - Math.pow(1 - t, 3);

export async function initGlobeLab(root:HTMLElement, variant:Variant){
 const look = LOOKS[variant];
 const stage = root.querySelector<HTMLElement>('.globe-stage')!;
 const status = document.querySelector<HTMLElement>('[data-globe-status]');
 const pins:Pin[] = JSON.parse(root.dataset.pins || '[]');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(35, 1, .1, 200);
 const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
 renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setClearColor(0x000000, 0);
 stage.prepend(renderer.domElement); renderer.domElement.setAttribute('aria-hidden', 'true');

 const controls = new OrbitControls(camera, renderer.domElement);
 Object.assign(controls, { enablePan:false, enableDamping:true, dampingFactor:.07, minDistance:1.35, maxDistance:6, enableZoom:false, rotateSpeed:.55, minPolarAngle:.12, maxPolarAngle:Math.PI - .12, autoRotate:!reduced, autoRotateSpeed:look.spin });
 controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

 const initial = position(24, 95, variant === 'g3' ? 4.6 : 3.65);
 // Intro: start far and a third of a turn away, then settle on the home view.
 camera.position.copy(reduced ? initial : position(8, -10, 7.5)); controls.update();
 let target:THREE.Vector3|undefined = reduced ? undefined : initial.clone();

 // Land texture from Natural Earth; also the source for the dot field.
 const W = 2048, H = 1024;
 const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
 const ctx = canvas.getContext('2d', { willReadFrequently:true })!;
 ctx.fillStyle = look.ocean; ctx.fillRect(0, 0, W, H);
 const response = await fetch('/maps/land.geojson'); if(!response.ok) throw Error('Map data unavailable');
 const land:Land = await response.json();
 ctx.fillStyle = look.land; ctx.strokeStyle = look.coast; ctx.lineWidth = .7;
 for(const feature of land.features){
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
  for(const polygon of polygons){ ctx.beginPath(); for(const ring of polygon){ ring.forEach(([lng, lat], i) => { const x = (lng + 180)/360*W, y = (90 - lat)/180*H; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); } ctx.fill('evenodd'); ctx.stroke(); }
 }

 const world = new THREE.Group(); scene.add(world);
 const disposables:{ dispose():void }[] = [];
 const keep = <T extends { dispose():void }>(x:T) => (disposables.push(x), x);

 if(look.dots){
  // Dark ocean ball, then land as evenly spread dots (Fibonacci sphere sampled against the land mask).
  world.add(new THREE.Mesh(keep(new THREE.SphereGeometry(.995, 96, 64)), keep(new THREE.MeshBasicMaterial({ color:look.ocean }))));
  const mask = ctx.getImageData(0, 0, W, H).data;
  const N = 26000, pts:number[] = [];
  for(let i = 0; i < N; i++){
   const y = 1 - 2*(i + .5)/N, r = Math.sqrt(1 - y*y), phi = i*Math.PI*(3 - Math.sqrt(5));
   const lat = Math.asin(y)*180/Math.PI; let lng = (phi*180/Math.PI) % 360; if(lng > 180) lng -= 360;
   const px = Math.min(W - 1, Math.floor((lng + 180)/360*W)), py = Math.min(H - 1, Math.floor((90 - lat)/180*H));
   const k = (py*W + px)*4; if(mask[k] < 128) continue; // land is drawn light on a dark ocean
   const v = position(lat, lng, 1.003); pts.push(v.x, v.y, v.z);
  }
  const geo = keep(new THREE.BufferGeometry()); geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  world.add(new THREE.Points(geo, keep(new THREE.PointsMaterial({ color:look.land, size:2.2*Math.min(devicePixelRatio, 2), sizeAttenuation:false, transparent:true, opacity:.92 }))));
 } else {
  const texture = keep(new THREE.CanvasTexture(canvas)); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  world.add(new THREE.Mesh(keep(new THREE.SphereGeometry(1, 96, 64)), keep(new THREE.MeshStandardMaterial({ map:texture, roughness:1, metalness:0 }))));
  scene.add(new THREE.AmbientLight(0xffffff, 1.9));
  const sun = new THREE.DirectionalLight(0xfff8e8, 2.6); sun.position.set(-3, 4, 5); camera.add(sun); scene.add(camera);
  const grid = keep(new THREE.LineBasicMaterial({ color:0x66735f, transparent:true, opacity:.13 }));
  for(let lat = -60; lat <= 60; lat += 30) world.add(new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(Array.from({ length:181 }, (_, i) => position(lat, i*2 - 180, 1.002)))), grid));
  for(let lng = -180; lng < 180; lng += 30) world.add(new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(Array.from({ length:91 }, (_, i) => position(i*2 - 90, lng, 1.002)))), grid));
 }

 // Atmosphere: a back-faced shell whose rim brightens toward the silhouette.
 const atmosphere = keep(new THREE.ShaderMaterial({
  uniforms:{ color:{ value:new THREE.Color(look.atmosphere) }, strength:{ value:look.atmosphereStrength } },
  vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform vec3 color;uniform float strength;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),4.);float a=f*strength*.9;gl_FragColor=vec4(color,a);}',
  side:THREE.BackSide, transparent:true, depthWrite:false }));
 scene.add(new THREE.Mesh(keep(new THREE.SphereGeometry(1.07, 64, 48)), atmosphere));

 if(look.stars){
  const s:number[] = []; for(let i = 0; i < 1400; i++){ const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random()*40); s.push(v.x, v.y, v.z); }
  const g = keep(new THREE.BufferGeometry()); g.setAttribute('position', new THREE.Float32BufferAttribute(s, 3));
  scene.add(new THREE.Points(g, keep(new THREE.PointsMaterial({ color:0xf6f3ed, size:.09, transparent:true, opacity:.55 }))));
 }

 // Pins: a ring that pulses outward on the surface, and (night look) a beam of light.
 const ringGeo = keep(new THREE.RingGeometry(.018, .024, 48));
 const rings = pins.map((pin, i) => {
  const mat = keep(new THREE.MeshBasicMaterial({ color:look.ring, transparent:true, side:THREE.DoubleSide, depthWrite:false }));
  const mesh = new THREE.Mesh(ringGeo, mat); const p = position(pin.lat, pin.lng, 1.006); mesh.position.copy(p); mesh.lookAt(p.clone().multiplyScalar(2)); world.add(mesh);
  const dot = new THREE.Mesh(keep(new THREE.CircleGeometry(.009, 24)), keep(new THREE.MeshBasicMaterial({ color:look.ring, side:THREE.DoubleSide }))); dot.position.copy(p); dot.lookAt(p.clone().multiplyScalar(2)); world.add(dot);
  if(look.beams){
   const beam = new THREE.Mesh(keep(new THREE.CylinderGeometry(.0025, .0025, .22, 8, 1, true)), keep(new THREE.MeshBasicMaterial({ color:0xf3e7c2, transparent:true, opacity:.55, blending:THREE.AdditiveBlending, depthWrite:false })));
   beam.position.copy(position(pin.lat, pin.lng, 1.11)); beam.lookAt(new THREE.Vector3()); beam.rotateX(Math.PI/2); world.add(beam);
  }
  return { mesh, mat, phase:i*.33 };
 });

 // Journey arcs in travel order (oldest first), drawn one after another; a comet runs along each when drawn.
 const order = [...pins].reverse();
 const arcs = order.slice(1).map((pin, i) => {
  const a = position(order[i].lat, order[i].lng), b = position(pin.lat, pin.lng);
  const height = .12 + a.angleTo(b)*.18, n = 160;
  const points = Array.from({ length:n + 1 }, (_, k) => { const t = k/n; return a.clone().lerp(b, t).normalize().multiplyScalar(1.004 + Math.sin(Math.PI*t)*height); });
  const geo = keep(new THREE.BufferGeometry().setFromPoints(points)); geo.setDrawRange(0, 0);
  const line = new THREE.Line(geo, keep(new THREE.LineBasicMaterial({ color:look.arc, transparent:true, opacity:variant === 'g2' ? .9 : .75 }))); world.add(line);
  const comet = new THREE.Mesh(keep(new THREE.SphereGeometry(variant === 'g2' ? .012 : .009, 16, 12)), keep(new THREE.MeshBasicMaterial({ color:variant === 'g2' ? 0xfff4d6 : 0x4f594c })));
  comet.visible = false; world.add(comet);
  return { geo, points, comet, n, drawn:0 };
 });
 let arcsUpTo = variant === 'g3' ? 0 : arcs.length; // g3 reveals arcs as chapters arrive
 const arcStart = performance.now() + (reduced ? 0 : 1400);

 // DOM photo pins (same as the published globe).
 const markerRoot = root.querySelector<HTMLElement>('.globe-markers')!;
 const markers = pins.map(pin => {
  const button = document.createElement('button'); button.className = 'globe-photo-pin'; button.setAttribute('aria-label', `${pin.label} 사진 위치 확대`);
  const img = document.createElement('img'); img.src = pin.image; img.alt = ''; button.append(img);
  const label = document.createElement('span'); label.textContent = pin.label; button.append(label); markerRoot.append(button);
  return { pin, button, local:position(pin.lat, pin.lng, 1.025) };
 });

 let active = ''; let idleTimer = 0;
 const pause = () => { controls.autoRotate = false; clearTimeout(idleTimer); };
 const resumeLater = () => { clearTimeout(idleTimer); if(reduced || variant === 'g3') return; idleTimer = window.setTimeout(() => { if(!active) controls.autoRotate = true; }, 5000); };
 const focus = (pin:Pin) => { pause(); target = position(pin.lat, pin.lng, 2.35); active = pin.id; markers.forEach(m => m.button.classList.toggle('is-active', m.pin.id === active)); if(status) status.textContent = `${pin.label} · 사진을 다시 누르면 여행기가 열립니다.`; };
 const reset = () => { target = initial.clone(); active = ''; markers.forEach(m => m.button.classList.remove('is-active')); if(status) status.textContent = '지구본에서 마음이 가는 곳을 골라 보세요.'; resumeLater(); };
 markers.forEach(m => m.button.addEventListener('click', () => active === m.pin.id ? location.href = m.pin.href : focus(m.pin)));
 document.querySelectorAll<HTMLButtonElement>('[data-globe-pin]').forEach(b => b.addEventListener('click', () => { const p = pins.find(x => x.id === b.dataset.globePin); if(p) focus(p); }));
 root.querySelector('[data-globe-reset]')?.addEventListener('click', reset);
 controls.addEventListener('start', () => { pause(); target = undefined; });
 controls.addEventListener('end', resumeLater);
 renderer.domElement.addEventListener('touchstart', e => { controls.enableZoom = e.touches.length > 1; }, { passive:true });

 // Pointer parallax: the globe leans slightly toward the cursor.
 const lean = { x:0, y:0 };
 if(!reduced && matchMedia('(hover: hover)').matches) stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); lean.x = ((e.clientY - r.top)/r.height - .5)*.16; lean.y = ((e.clientX - r.left)/r.width - .5)*.22; });
 stage.addEventListener('pointerleave', () => { lean.x = 0; lean.y = 0; });

 // g3: chapters scrolling past drive the camera and the arcs.
 if(variant === 'g3'){
  controls.autoRotate = false;
  const chapters = document.querySelectorAll<HTMLElement>('[data-chapter]');
  const io = new IntersectionObserver(entries => { for(const e of entries){ if(!e.isIntersecting) continue; const i = Number(e.target.getAttribute('data-chapter'));
   chapters.forEach(c => c.classList.toggle('is-current', c === e.target));
   if(i < 0){ reset(); arcsUpTo = 0; continue; }
   const pin = order[i]; focus(pin); arcsUpTo = i; } }, { rootMargin:'-45% 0px -45% 0px' });
  chapters.forEach(c => io.observe(c));
 }

 const resize = new ResizeObserver(() => { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h); camera.aspect = w/h; camera.updateProjectionMatrix(); }); resize.observe(stage);
 let visible = true; const vis = new IntersectionObserver(e => { visible = e[0].isIntersecting; }); vis.observe(stage);
 root.querySelector<HTMLElement>('.globe-fallback')!.hidden = true; root.dataset.ready = 'true';

 const projected = new THREE.Vector3(), dir = new THREE.Vector3(), worldPos = new THREE.Vector3();
 const clock = new THREE.Clock();
 renderer.setAnimationLoop(() => {
  if(!visible || document.hidden) return;
  const t = clock.getElapsedTime(), now = performance.now();
  if(target){ camera.position.lerp(target, reduced ? 1 : .055); if(camera.position.distanceTo(target) < .003){ camera.position.copy(target); target = undefined; } }
  world.rotation.x += (lean.x - world.rotation.x)*.06; world.rotation.y += (lean.y - world.rotation.y)*.06;
  rings.forEach(r => { const p = reduced ? .4 : ((t*.55 + r.phase) % 1); r.mesh.scale.setScalar(1 + easeOut(p)*2.4); r.mat.opacity = (1 - p)*.85; });
  arcs.forEach((a, i) => {
   const want = i < arcsUpTo && now > arcStart + i*900 ? a.n + 1 : 0;
   a.drawn = reduced ? want : a.drawn + (want - a.drawn)*.06; a.geo.setDrawRange(0, Math.round(a.drawn));
   const done = a.drawn > a.n - 1; a.comet.visible = done && !reduced;
   if(a.comet.visible){ const k = ((t*.25 + i*.37) % 1)*a.n; a.comet.position.copy(a.points[Math.floor(k)]); }
  });
  controls.update(); renderer.render(scene, camera);
  dir.copy(camera.position).normalize();
  const list = markers.map(m => { worldPos.copy(m.local).applyMatrix4(world.matrixWorld); const front = worldPos.clone().normalize().dot(dir) > 1/camera.position.length(); projected.copy(worldPos).project(camera);
   return { ...m, x:(projected.x*.5 + .5)*stage.clientWidth, y:(-projected.y*.5 + .5)*stage.clientHeight, show:front && Math.abs(projected.x) < .96 && Math.abs(projected.y) < .93 }; });
  list.forEach((m, i) => { m.button.hidden = !m.show; if(!m.show) return; const crowded = list.some((o, j) => j !== i && o.show && Math.hypot(m.x - o.x, m.y - o.y) < 90); const off = crowded ? (i % 2 ? 40 : -40) : 0;
   m.button.style.setProperty('--pin-offset', `${off}px`); m.button.style.left = `${m.x + off}px`; m.button.style.top = `${m.y}px`; });
 });
 window.addEventListener('pagehide', () => { renderer.setAnimationLoop(null); resize.disconnect(); vis.disconnect(); controls.dispose(); disposables.forEach(d => d.dispose()); renderer.dispose(); }, { once:true });
}
