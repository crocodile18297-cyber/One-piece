import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const socket=io(),scene=new THREE.Scene();scene.background=new THREE.Color(0x91c9e9);scene.fog=new THREE.Fog(0x91c9e9,38,100);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,160);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.getElementById("game").appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdff4ff,0x526477,2.1));const sun=new THREE.DirectionalLight(0xffedce,3.2);sun.position.set(-12,22,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
const mat=(c,r=.65,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const floor=new THREE.Mesh(new THREE.CircleGeometry(48,96),mat(0x267c68,.95));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const inner=new THREE.Mesh(new THREE.CircleGeometry(18,96),mat(0x398d70));inner.rotation.x=-Math.PI/2;inner.position.y=.012;scene.add(inner);
for(const r of [18,18.3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.09,8,100),mat(r===18?0xe8c67a:0x183e3b,.4,.3));ring.rotation.x=Math.PI/2;ring.position.y=.08;scene.add(ring)}
for(let i=0;i<32;i++){const a=i/32*Math.PI*2,r=26+Math.sin(i*3)*4;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.3+Math.random()*2,1),mat(i%2?0x718b84:0x8b9a91));rock.position.set(Math.cos(a)*r,.4,Math.sin(a)*r);rock.scale.y=.8;rock.castShadow=true;scene.add(rock)}
function mesh(g,m,parent,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function pirate(){
 const root=new THREE.Group(),rig={};const skin=mat(0xf0b98e),skinDark=mat(0xd99069),red=mat(0xc8322b),redDark=mat(0x87231f),blue=mat(0x2860a6),blueDark=mat(0x173d72),straw=mat(0xe7b94e),strawDark=mat(0x9d6b2d),black=mat(0x211e22),white=mat(0xf5eee0),gold=mat(0xe9b84f,.28,.65);
 // torso and open red vest
 rig.torso=new THREE.Group();rig.torso.position.y=1.35;root.add(rig.torso);
 mesh(new THREE.CylinderGeometry(.34,.43,.78,12),skin,rig.torso,0,.18,0);
 mesh(new THREE.BoxGeometry(.78,.8,.38),red,rig.torso,0,.18,-.015);
 mesh(new THREE.BoxGeometry(.17,.65,.405),skin,rig.torso,-.105,.18,.018);mesh(new THREE.BoxGeometry(.17,.65,.405),skin,rig.torso,.105,.18,.018);
 mesh(new THREE.SphereGeometry(.07,12,10),gold,rig.torso,0,-.16,.22);
 // shorts and belt
 mesh(new THREE.CylinderGeometry(.42,.38,.2,12),blueDark,root,0,.92,0);
 mesh(new THREE.BoxGeometry(.83,.48,.43),blue,root,0,.68,0);
 mesh(new THREE.BoxGeometry(.88,.12,.46),redDark,root,0,.91,0);mesh(new THREE.BoxGeometry(.16,.14,.05),gold,root,0,.91,.24);
 // legs with pivot joints
 rig.legs=[];
 for(const x of [-.2,.2]){const pivot=new THREE.Group();pivot.position.set(x,.53,0);root.add(pivot);mesh(new THREE.CylinderGeometry(.13,.15,.42,10),skin,pivot,0,-.19,0);mesh(new THREE.BoxGeometry(.29,.13,.42),black,pivot,0,-.42,.08);mesh(new THREE.BoxGeometry(.31,.08,.43),strawDark,pivot,0,-.33,.12);rig.legs.push(pivot)}
 // arms pivoted at shoulders
 rig.arms=[];
 for(const x of [-.49,.49]){const p=new THREE.Group();p.position.set(x,1.66,0);rig.torso.add(p);mesh(new THREE.SphereGeometry(.19,12,10),skin,p,0,-.06,0);mesh(new THREE.CylinderGeometry(.115,.14,.55,10),skin,p,0,-.37,0);mesh(new THREE.SphereGeometry(.14,12,10),skin,p,0,-.68,.015);rig.arms.push(p)}
 // neck, head, ears, facial features
 mesh(new THREE.CylinderGeometry(.13,.14,.2,10),skin,root,0,1.92,0);
 rig.head=new THREE.Group();rig.head.position.set(0,2.28,0);root.add(rig.head);
 mesh(new THREE.SphereGeometry(.34,24,18),skin,rig.head,0,0,0,1,.98,.88);
 mesh(new THREE.SphereGeometry(.09,12,10),skin,rig.head,-.34,-.02,0);mesh(new THREE.SphereGeometry(.09,12,10),skin,rig.head,.34,-.02,0);
 // hair cap and side locks
 mesh(new THREE.SphereGeometry(.34,18,12,0,Math.PI*2,0,Math.PI*.55),mat(0x241c19),rig.head,0,.18,-.01);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;mesh(new THREE.ConeGeometry(.105,.28,7),mat(0x241c19),rig.head,Math.cos(a)*.25,.16,Math.sin(a)*.22).rotation.z=Math.cos(a)*-.55}
 // eyes, brows, nose, grin and scar
 for(const x of [-.13,.13]){mesh(new THREE.SphereGeometry(.045,12,10),white,rig.head,x,.015,.292);mesh(new THREE.SphereGeometry(.022,10,8),black,rig.head,x,.012,.33);mesh(new THREE.BoxGeometry(.11,.025,.025),black,rig.head,x,.105,.29)}
 mesh(new THREE.SphereGeometry(.035,10,8),skinDark,rig.head,0,-.08,.31);
 const mouth=mesh(new THREE.TorusGeometry(.09,.012,6,16,Math.PI),redDark,rig.head,0,-.16,.286);mouth.rotation.z=Math.PI;
 mesh(new THREE.BoxGeometry(.15,.022,.012),redDark,rig.head,.04,-.01,.32).rotation.z=-.65;
 // iconic straw hat: brim, crown, red band, stitching
 mesh(new THREE.CylinderGeometry(.51,.51,.055,32),straw,rig.head,0,.34,0);
 mesh(new THREE.CylinderGeometry(.29,.32,.24,24),straw,rig.head,0,.47,0);
 mesh(new THREE.TorusGeometry(.31,.025,8,32),red,rig.head,0,.43,0);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;mesh(new THREE.SphereGeometry(.012,6,5),strawDark,rig.head,Math.cos(a)*.46,.375,Math.sin(a)*.46)}
 // subtle sandals and details
 root.userData={rig,baseScale:1,gear:2};return root;
}
const local=pirate();scene.add(local);const others=new Map(),effects=[];let myId=null,gear=2,hp=100,yaw=0,velocityY=0,onGround=true;const keys={};let lastSend=0,attackLock=0,combo=0,comboTimer=0;
function aura(p,n){if(p.userData.aura){p.remove(p.userData.aura);p.userData.aura.geometry.dispose()}if(n===2)return;const color=n===5?0xffffff:n===4?0x9c59ff:0xff9a39;const a=new THREE.Mesh(new THREE.TorusGeometry(n===3?1.1:.85,.045,8,40),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));a.rotation.x=Math.PI/2;a.position.y=.16;p.add(a);p.userData.aura=a}
function setGear(n){gear=n;local.userData.gear=n;local.scale.setScalar(n===3?1.18:n===4?1.08:1);aura(local,n);document.querySelectorAll(".gear").forEach(b=>b.classList.toggle("active",+b.dataset.gear===n));document.getElementById("gearLabel").textContent="GEAR "+n+" · "+({2:"BASE",3:"GIANT",4:"BOUND-MAN",5:"NIKA"}[n]);socket.emit("move",{x:local.position.x,z:local.position.z,gear:n});toast("GEAR "+n+" ACTIVATED")}
document.querySelectorAll(".gear").forEach(b=>b.onclick=()=>setGear(+b.dataset.gear));
function toast(s){const e=document.getElementById("toast");e.textContent=s;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1250)}
function addOther(p){if(others.has(p.id))return;const m=pirate();m.position.set(p.x||0,0,p.z||0);scene.add(m);others.set(p.id,m);updateOnline();if(p.gear)aura(m,p.gear)}
function updateOnline(){document.getElementById("online").textContent=(others.size+1)+" пират(ов) онлайн"}
socket.on("welcome",d=>{myId=d.id;d.players.filter(p=>p.id!==myId).forEach(addOther);updateOnline();toast("Добро пожаловать на Гранд-лайн")});
socket.on("player-joined",p=>{addOther(p);toast("Новый пират присоединился")});
socket.on("player-moved",p=>{const m=others.get(p.id);if(m){m.userData.target=new THREE.Vector3(p.x,0,p.z);if(m.userData.gear!==p.gear){m.userData.gear=p.gear;aura(m,p.gear)}}});
socket.on("player-left",id=>{const m=others.get(id);if(m){scene.remove(m);others.delete(id);updateOnline()}});
socket.on("got-hit",d=>{hp=d.hp;updateHealth();local.userData.hitFlash=.18;toast("ПОПАДАНИЕ · -"+Math.round(d.damage)+" HP");if(hp<=0){toast("ТЫ ПРОИГРАЛ · ВОЗРОЖДЕНИЕ");setTimeout(()=>socket.emit("respawn"),1800)}});
socket.on("stats",p=>{hp=p.hp;local.position.set(p.x,0,p.z);updateHealth()});socket.on("player-respawned",p=>{const m=others.get(p.id);if(m){m.position.set(p.x,0,p.z)}});
function updateHealth(){document.getElementById("hpText").textContent=hp+" / 100";document.getElementById("hpBar").style.width=hp+"%"}
function attack(kind="pistol"){const now=performance.now();if(now<attackLock)return;const cd={pistol:280,gatling:105,kong:950,redhawk:700,rifle:580}[kind];attackLock=now+cd;combo=comboTimer>now?combo%3+1:1;comboTimer=now+850;const rig=local.userData.rig,arm=rig.arms[1];arm.rotation.x=-1.35;arm.rotation.z=-.3;setTimeout(()=>{arm.rotation.x=0;arm.rotation.z=0},180);
 const n=gear,color=n===5?0xffffff:n===4?0x9d5cff:n===3?0xffc15a:kind==="redhawk"?0xff321f:0xff7a39;
 const size=kind==="kong"?1.1:kind==="gatling"?.34:.55;const orb=new THREE.Mesh(new THREE.SphereGeometry(size,20,16),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.84}));orb.position.copy(local.position).add(new THREE.Vector3(Math.sin(yaw)*1.15,1.45,Math.cos(yaw)*1.15));scene.add(orb);
 const dir=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));effects.push({mesh:orb,dir,life:kind==="gatling"?13:28,speed:kind==="kong"?.72:.95});
 const ring=new THREE.Mesh(new THREE.TorusGeometry(kind==="kong"?1.25:.55,.055,8,28),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));ring.position.copy(orb.position);ring.rotation.x=Math.PI/2;scene.add(ring);effects.push({mesh:ring,dir:new THREE.Vector3(),life:14,speed:0});
 socket.emit("attack",{kind});}
document.getElementById("pistol").onclick=()=>attack("pistol");document.getElementById("gatling").onclick=()=>attack("gatling");document.getElementById("kong").onclick=()=>attack("kong");
addEventListener("pointerdown",e=>{if(e.target===renderer.domElement)attack("pistol")});
addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(["1","2","3","4"].includes(e.key))setGear(+e.key+1);if(e.key.toLowerCase()==="g")attack("gatling");if(e.key.toLowerCase()==="h")attack("kong");if(e.key.toLowerCase()==="f")attack("redhawk");if(e.key.toLowerCase()==="r")attack("rifle")});
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
let joy={x:0,y:0},touching=false;const stick=document.getElementById("stick"),knob=document.getElementById("knob");
function joyMove(e){const r=stick.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),l=Math.hypot(dx,dy),max=36;if(l>max){dx=dx/l*max;dy=dy/l*max}joy.x=dx/max;joy.y=dy/max;knob.style.transform="translate("+dx+"px,"+dy+"px)"}
stick.addEventListener("pointerdown",e=>{touching=true;stick.setPointerCapture(e.pointerId);joyMove(e)});stick.addEventListener("pointermove",e=>{if(touching)joyMove(e)});stick.addEventListener("pointerup",()=>{touching=false;joy={x:0,y:0};knob.style.transform="translate(0,0)"});
document.getElementById("mJump").onclick=()=>{if(onGround){velocityY=8.5;onGround=false}};document.getElementById("mAttack").onclick=()=>attack("pistol");
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime,rig=local.userData.rig;let dx=(keys.d?1:0)-(keys.a?1:0)+joy.x,dz=(keys.s?1:0)-(keys.w?1:0)+joy.y,len=Math.hypot(dx,dz);if(len>1){dx/=len;dz/=len}const moving=len>.08,speed=gear===4?8.5:gear===5?7.5:gear===3?5.2:6.5;local.position.x=THREE.MathUtils.clamp(local.position.x+dx*speed*dt,-43,43);local.position.z=THREE.MathUtils.clamp(local.position.z+dz*speed*dt,-43,43);if(moving){yaw=Math.atan2(dx,dz);local.rotation.y=yaw}
 if((keys[" "]||keys.space)&&onGround){velocityY=8.5;onGround=false}if(!onGround){local.position.y+=velocityY*dt;velocityY-=22*dt;if(local.position.y<=0){local.position.y=0;velocityY=0;onGround=true}}
 const swing=moving?Math.sin(t*11)*.48:Math.sin(t*2)*.025;rig.legs[0].rotation.x=swing;rig.legs[1].rotation.x=-swing;rig.arms[0].rotation.x=-swing*.7;rig.arms[1].rotation.x=swing*.7;rig.torso.rotation.z=moving?Math.sin(t*11)*.035:0;rig.head.rotation.y=Math.sin(t*1.4)*.035;
 if(local.userData.hitFlash>0){local.userData.hitFlash-=dt;local.traverse(o=>{if(o.isMesh&&o.material?.emissive){o.material.emissive.setHex(0xff2222);o.material.emissiveIntensity=.5}})}
 for(const m of others.values()){if(m.userData.target)m.position.lerp(m.userData.target,.2);const rr=m.userData.rig;if(rr){rr.legs[0].rotation.x=Math.sin(t*8)*.22;rr.legs[1].rotation.x=-Math.sin(t*8)*.22}}
 if(t-lastSend>.06){socket.emit("move",{x:local.position.x,z:local.position.z,gear});lastSend=t}
 for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.mesh.position.addScaledVector(f.dir,f.speed);f.life--;f.mesh.scale.multiplyScalar(1.035);if(f.life<=0){scene.remove(f.mesh);effects.splice(i,1)}}
 const target=new THREE.Vector3(local.position.x-Math.sin(yaw)*.25,local.position.y+5.3,local.position.z-Math.cos(yaw)*8.5);camera.position.lerp(target,.085);camera.lookAt(local.position.x,local.position.y+1.35,local.position.z);renderer.render(scene,camera)}
animate();addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
