import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const socket=io(),scene=new THREE.Scene();scene.background=new THREE.Color(0x91c9e9);scene.fog=new THREE.Fog(0x91c9e9,38,100);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,160);camera.position.set(0,6.65,-10.2);camera.lookAt(0,1.35,0);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;document.getElementById("game").appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdff4ff,0x526477,2.1));const sun=new THREE.DirectionalLight(0xffedce,3.2);sun.position.set(-12,22,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
const mat=(c,r=.65,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const floor=new THREE.Mesh(new THREE.CircleGeometry(48,96),mat(0x267c68,.95));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const inner=new THREE.Mesh(new THREE.CircleGeometry(18,96),mat(0x398d70));inner.rotation.x=-Math.PI/2;inner.position.y=.012;scene.add(inner);
for(const r of [18,18.3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.09,8,100),mat(r===18?0xe8c67a:0x183e3b,.4,.3));ring.rotation.x=Math.PI/2;ring.position.y=.08;scene.add(ring)}
for(let i=0;i<32;i++){const a=i/32*Math.PI*2,r=26+Math.sin(i*3)*4;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.3+Math.random()*2,1),mat(i%2?0x718b84:0x8b9a91));rock.position.set(Math.cos(a)*r,.4,Math.sin(a)*r);rock.scale.y=.8;rock.castShadow=true;scene.add(rock)}
function mesh(g,m,parent,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function pirate(){
 const root=new THREE.Group(),rig={};
 const skin=mat(0xf0b98e),skinShade=mat(0xd99069),red=mat(0xc8322b),redDark=mat(0x87231f),blue=mat(0x2860a6),blueDark=mat(0x173d72),straw=mat(0xe7b94e),strawDark=mat(0x9d6b2d),black=mat(0x211e22),white=mat(0xf5eee0),gold=mat(0xe9b84f,.28,.65),hairMat=mat(0x241c19),armamentMat=mat(0x171820,.32,.25),cloudMat=mat(0xf7f5ef,.85),steamMat=new THREE.MeshBasicMaterial({color:0xe9e9e9,transparent:true,opacity:.42});
 rig.materials={skin,armament:armamentMat};
 rig.torso=new THREE.Group();rig.torso.position.y=1.35;root.add(rig.torso);
 mesh(new THREE.CylinderGeometry(.34,.43,.78,16),skin,rig.torso,0,.18,0);
 rig.vest=mesh(new THREE.BoxGeometry(.78,.8,.38),red,rig.torso,0,.18,-.015);
 mesh(new THREE.BoxGeometry(.17,.65,.405),skin,rig.torso,-.105,.18,.018);mesh(new THREE.BoxGeometry(.17,.65,.405),skin,rig.torso,.105,.18,.018);
 // vest collar, seams and buttons
 for(const x of [-.19,.19]){const lapel=mesh(new THREE.BoxGeometry(.16,.48,.045),redDark,rig.torso,x,.38,.215);lapel.rotation.z=x<0?-.22:.22}
 for(let y=-.04;y<.34;y+=.16)mesh(new THREE.SphereGeometry(.025,8,6),gold,rig.torso,0,y,.225);
 // shorts, sash, buckle and pockets
 mesh(new THREE.CylinderGeometry(.42,.38,.2,16),blueDark,root,0,.92,0);
 mesh(new THREE.BoxGeometry(.83,.48,.43),blue,root,0,.68,0);
 mesh(new THREE.BoxGeometry(.88,.12,.46),redDark,root,0,.91,.0);
 mesh(new THREE.BoxGeometry(.16,.14,.05),gold,root,0,.91,.24);
 for(const x of [-.31,.31])mesh(new THREE.BoxGeometry(.16,.13,.035),blueDark,root,x,.74,.226);
 // leg joints, knees and sandals
 rig.legs=[];
 for(const x of [-.2,.2]){const p=new THREE.Group();p.position.set(x,.53,0);root.add(p);mesh(new THREE.CylinderGeometry(.13,.15,.42,12),skin,p,0,-.19,0);mesh(new THREE.SphereGeometry(.14,12,10),skinShade,p,0,-.39,.015);mesh(new THREE.BoxGeometry(.29,.13,.42),black,p,0,-.42,.08);mesh(new THREE.BoxGeometry(.31,.08,.43),strawDark,p,0,-.33,.12);mesh(new THREE.BoxGeometry(.32,.035,.06),gold,p,0,-.37,.32);rig.legs.push(p)}
 // arms with shoulders, elbows, forearms and fists
 rig.arms=[];rig.armParts=[];rig.fists=[];rig.shoulders=[];
 for(const x of [-.49,.49]){const p=new THREE.Group();p.position.set(x,1.66,0);rig.torso.add(p);const shoulder=mesh(new THREE.SphereGeometry(.19,14,12),skin,p,0,-.06,0);const upper=mesh(new THREE.CylinderGeometry(.125,.15,.29,12),skin,p,0,-.22,0);const elbow=mesh(new THREE.SphereGeometry(.12,12,10),skin,p,0,-.36,.01);const fore=mesh(new THREE.CylinderGeometry(.115,.14,.34,12),skin,p,0,-.53,.01);const fist=mesh(new THREE.SphereGeometry(.14,14,12),skin,p,0,-.72,.025);rig.shoulders.push(shoulder);rig.armParts.push(fore);rig.fists.push(fist);rig.arms.push(p)}
 mesh(new THREE.CylinderGeometry(.13,.14,.2,12),skin,root,0,1.92,0);
 rig.head=new THREE.Group();rig.head.position.set(0,2.28,0);root.add(rig.head);
 mesh(new THREE.SphereGeometry(.34,28,22),skin,rig.head,0,0,0,1,.98,.88);
 for(const x of [-.34,.34])mesh(new THREE.SphereGeometry(.09,12,10),skin,rig.head,x,-.02,0);
 // Hair cap and locks
 rig.hair=mesh(new THREE.SphereGeometry(.34,22,16,0,Math.PI*2,0,Math.PI*.55),hairMat,rig.head,0,.18,-.01);
 rig.hairSpikes=[];
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2,sp=mesh(new THREE.ConeGeometry(.09,.25,8),hairMat,rig.head,Math.cos(a)*.25,.16,Math.sin(a)*.22);sp.rotation.z=Math.cos(a)*-.55;sp.rotation.x=Math.sin(a)*.3;rig.hairSpikes.push(sp)}
 // face, eyes, brows, scar and smile
 for(const x of [-.13,.13]){mesh(new THREE.SphereGeometry(.047,12,10),white,rig.head,x,.015,.292);mesh(new THREE.SphereGeometry(.024,10,8),black,rig.head,x,.012,.33);mesh(new THREE.BoxGeometry(.12,.025,.025),black,rig.head,x,.105,.29)}
 mesh(new THREE.SphereGeometry(.035,10,8),skinShade,rig.head,0,-.08,.31);
 const mouth=mesh(new THREE.TorusGeometry(.09,.012,6,16,Math.PI),redDark,rig.head,0,-.16,.286);mouth.rotation.z=Math.PI;
 mesh(new THREE.BoxGeometry(.15,.022,.012),redDark,rig.head,.04,-.01,.32).rotation.z=-.65;
 // detailed straw hat with brim, crown, band and stitching
 rig.hat=new THREE.Group();rig.head.add(rig.hat);
 mesh(new THREE.CylinderGeometry(.51,.51,.055,40),straw,rig.hat,0,.34,0);
 mesh(new THREE.CylinderGeometry(.29,.32,.24,28),straw,rig.hat,0,.47,0);
 mesh(new THREE.TorusGeometry(.31,.025,8,36),red,rig.hat,0,.43,0);
 for(let i=0;i<32;i++){const a=i/32*Math.PI*2;mesh(new THREE.SphereGeometry(.011,6,5),strawDark,rig.hat,Math.cos(a)*.46,.375,Math.sin(a)*.46)}
 // Gear-specific geometry, hidden until activated
 rig.gear3=new THREE.Group();root.add(rig.gear3);
 const giantArm=new THREE.Group();giantArm.position.set(.52,1.45,.03);rig.gear3.add(giantArm);
 mesh(new THREE.SphereGeometry(.37,18,14),skin,giantArm,0,-.08,0,1.08,1.1,1);
 mesh(new THREE.CylinderGeometry(.27,.34,.68,18),skin,giantArm,0,-.48,.02,1.08,1,1);
 mesh(new THREE.SphereGeometry(.38,20,16),skin,giantArm,0,-.92,.04,1.12,.95,1.08);
 for(let i=0;i<4;i++)mesh(new THREE.CapsuleGeometry(.065,.26,5,8),skin,giantArm,-.23+i*.15,-1.17,.22,1,1,1);
 rig.giantArm=giantArm;
 rig.gear4=new THREE.Group();root.add(rig.gear4);
 // inflated Boundman chest, shoulders, arms and Haki coating
 mesh(new THREE.SphereGeometry(.55,20,16),red,rig.gear4,0,1.52,-.015,1.12,1.05,.78);
 mesh(new THREE.TorusGeometry(.62,.105,10,32),redDark,rig.gear4,0,1.23,0);
 for(const x of [-.58,.58]){mesh(new THREE.SphereGeometry(.29,16,12),red,rig.gear4,x,1.72,0,1.15,1,1);mesh(new THREE.SphereGeometry(.19,16,12),armamentMat,rig.gear4,x*1.35,1.25,.05,1,1.2,1)}
 rig.gear4Arms=[];
 for(const x of [-.78,.78]){const a=new THREE.Group();a.position.set(x,1.52,0);rig.gear4.add(a);mesh(new THREE.CylinderGeometry(.2,.25,.62,14),armamentMat,a,0,-.31,0);mesh(new THREE.SphereGeometry(.27,16,12),armamentMat,a,0,-.68,.04,1,1,1.12);rig.gear4Arms.push(a)}
 // Gear 5: white cloud mantle, floating cloud loops and white hair overlay
 rig.gear5=new THREE.Group();root.add(rig.gear5);
 const cloud=new THREE.Group();cloud.position.set(0,1.52,-.02);rig.gear5.add(cloud);
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2;mesh(new THREE.SphereGeometry(.19,12,10),cloudMat,cloud,Math.cos(a)*.48,Math.sin(a)*.23,Math.sin(a)*.25,1.25,.8,1)}
 rig.cloudRing=new THREE.Mesh(new THREE.TorusGeometry(.63,.12,12,48),new THREE.MeshStandardMaterial({color:0xf7f3e9,roughness:.9}));rig.cloudRing.rotation.x=Math.PI/2;rig.cloudRing.position.y=1.28;rig.gear5.add(rig.cloudRing);
 rig.whiteHair=new THREE.Group();rig.head.add(rig.whiteHair);
 mesh(new THREE.SphereGeometry(.36,20,14),cloudMat,rig.whiteHair,0,.18,-.01);
 for(let i=0;i<11;i++){const a=i/11*Math.PI*2;const p=mesh(new THREE.ConeGeometry(.105,.3,8),cloudMat,rig.whiteHair,Math.cos(a)*.26,.17,Math.sin(a)*.22);p.rotation.z=Math.cos(a)*-.6;p.rotation.x=Math.sin(a)*.3}
 rig.gear5.visible=false;rig.gear4.visible=false;rig.gear3.visible=false;
 rig.cloudRing=rig.cloudRing;
 root.userData={rig,baseScale:1,gear:2,haki:false};
 applyCharacterGear(root,2);
 return root;
}
function applyCharacterGear(character,n){
 const r=character.userData.rig;if(!r)return;
 character.userData.gear=n;
 r.gear3.visible=n===3;r.gear4.visible=n===4;r.gear5.visible=n===5;
 r.hat.visible=n!==5;r.hair.visible=n!==5;r.hairSpikes.forEach(p=>p.visible=n!==5);
 r.whiteHair.visible=n===5;
 character.scale.setScalar(n===3?1.08:n===4?1.1:1);
 r.torso.scale.set(n===4?1.16:1,n===4?1.08:1,n===4?1.08:1);
 r.arms.forEach(a=>a.visible=n!==3&&n!==4);
 r.legs.forEach(a=>a.scale.setScalar(n===4?1.12:1));
 if(n===3){r.giantArm.visible=true;r.giantArm.rotation.z=-.15}
 if(n===5){r.cloudRing.visible=true;r.cloudRing.rotation.z=0}
 r.vest.visible=n!==4&&n!==5;
 // Gear materials are created once on the rig; no external closure variables are needed.
}
function setCharacterHaki(character,on){
 const r=character.userData.rig;if(!r)return;character.userData.haki=on;
 const material=on?r.materials.armament:r.materials.skin;
 r.armParts.forEach(p=>p.material=material);
 r.fists.forEach(p=>p.material=material);
 r.shoulders.forEach(p=>p.material=material);
}

const local=pirate();scene.add(local);const others=new Map(),effects=[];
const bossRoot=new THREE.Group();bossRoot.position.set(0,0,-15);scene.add(bossRoot);
const bossMat=mat(0x26384d,.42,.45),bossGold=mat(0xd8a84e,.3,.55),bossCape=mat(0x8d2935,.8),bossSkin=mat(0xd99b78);
mesh(new THREE.CylinderGeometry(.72,.95,1.65,12),bossMat,bossRoot,0,1.25,0);
mesh(new THREE.BoxGeometry(1.9,.28,.72),bossGold,bossRoot,0,1.85,0);
mesh(new THREE.SphereGeometry(.49,18,14),bossSkin,bossRoot,0,2.45,0);
mesh(new THREE.CylinderGeometry(.52,.8,1.8,12,1,true),bossCape,bossRoot,0,1.35,-.35);
mesh(new THREE.CylinderGeometry(.18,.22,.72,10),bossMat,bossRoot,-.82,1.25,0);
mesh(new THREE.CylinderGeometry(.18,.22,.72,10),bossMat,bossRoot,.82,1.25,0);
mesh(new THREE.BoxGeometry(.55,.15,.12),bossGold,bossRoot,0,2.48,.43);
const bossRing=new THREE.Mesh(new THREE.TorusGeometry(1.35,.07,10,48),new THREE.MeshBasicMaterial({color:0xffcf65,transparent:true,opacity:.8}));bossRing.rotation.x=Math.PI/2;bossRing.position.y=.12;bossRoot.add(bossRing);
let bossHp=900,bossMax=900,bossPhase="idle",skillPoints=0,unlockedSkills=[];
function updateBossHud(){const bar=document.getElementById("bossBar");if(bar)bar.style.width=(bossHp/bossMax*100)+"%";const label=document.getElementById("bossHpText");if(label)label.textContent=Math.ceil(bossHp)+" / "+bossMax}
function progressUpdate(d){skillPoints=d.skillPoints||0;unlockedSkills=d.unlocked||[];document.getElementById("skillPoints").textContent=skillPoints;document.getElementById("unlockConqueror").disabled=unlockedSkills.includes("conqueror")||skillPoints<2;document.getElementById("unlockWill").disabled=unlockedSkills.includes("will")||skillPoints<1;document.getElementById("specialBtn").disabled=!unlockedSkills.includes("conqueror");document.getElementById("specialBtn").classList.toggle("selected",unlockedSkills.includes("conqueror"))}
function bossBurst(){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.12,10,48),new THREE.MeshBasicMaterial({color:0xffd16b,transparent:true,opacity:.95}));ring.rotation.x=Math.PI/2;ring.position.set(bossRoot.position.x,.18,bossRoot.position.z);scene.add(ring);effects.push({mesh:ring,dir:new THREE.Vector3(),life:35,speed:.12})}
socket.on("boss-state",d=>{bossHp=d.hp;bossMax=d.maxHp;bossPhase=d.phase;bossRoot.position.set(d.x,0,d.z);updateBossHud();bossRoot.visible=d.hp>0;});
socket.on("boss-warning",d=>{const warn=new THREE.Mesh(new THREE.RingGeometry((d.radius||8)-.18,d.radius||8,64),new THREE.MeshBasicMaterial({color:0xff3c2d,transparent:true,opacity:.7,side:THREE.DoubleSide}));warn.rotation.x=-Math.PI/2;warn.position.set(d.x,.035,d.z);scene.add(warn);effects.push({mesh:warn,dir:new THREE.Vector3(),life:36,speed:0});bossRoot.traverse(o=>{if(o.material?.emissive){o.material.emissive.setHex(0xff3b24);o.material.emissiveIntensity=1}});toast("БОСС ГОТОВИТ УДАР! ОТОЙДИ!");});
socket.on("boss-slam",()=>{bossBurst();bossRoot.traverse(o=>{if(o.material?.emissive)o.material.emissive.setHex(0x000000)})});
socket.on("boss-defeated",d=>{bossRoot.visible=false;if(d.by===myId)toast("БОСС ПОБЕЖДЁН! +1 ОЧКО НАВЫКА");else toast("БОСС ПОВЕРЖЕН!")});
socket.on("progress",progressUpdate);
socket.on("conqueror-wave",d=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.7,.12,10,48),new THREE.MeshBasicMaterial({color:0x8d5bff,transparent:true,opacity:.9}));r.rotation.x=Math.PI/2;r.position.set(d.x,.35,d.z);scene.add(r);effects.push({mesh:r,dir:new THREE.Vector3(),life:45,speed:.16});});
let myId=null,gear=2,hp=100,yaw=0,cameraYaw=0,cameraPitch=.48,cameraDistance=11.5,velocityY=0,onGround=true;const keys={};let lastSend=0,attackLock=0,combo=0,comboTimer=0;
function aura(p,n){if(p.userData.aura){p.remove(p.userData.aura);p.userData.aura.geometry.dispose()}if(n===2)return;const color=n===5?0xffffff:n===4?0x9c59ff:0xff9a39;const a=new THREE.Mesh(new THREE.TorusGeometry(n===3?1.1:.85,.045,8,40),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));a.rotation.x=Math.PI/2;a.position.y=.16;p.add(a);p.userData.aura=a}
function setGear(n){gear=n;local.userData.gear=n;applyCharacterGear(local,n);setCharacterHaki(local,hakiOn);aura(local,n);document.querySelectorAll(".gear").forEach(b=>b.classList.toggle("active",+b.dataset.gear===n));document.getElementById("gearLabel").textContent="GEAR "+n+" · "+({2:"BASE",3:"GIANT",4:"BOUND-MAN",5:"NIKA"}[n]);socket.emit("move",{x:local.position.x,z:local.position.z,gear:n});toast("GEAR "+n+" ACTIVATED")}
document.querySelectorAll(".gear").forEach(b=>b.onclick=()=>setGear(+b.dataset.gear));
function toast(s){const e=document.getElementById("toast");e.textContent=s;e.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.opacity=0,1250)}
function addOther(p){if(others.has(p.id))return;const m=pirate();m.position.set(p.x||0,0,p.z||0);m.rotation.y=Number(p.yaw)||0;m.userData.targetYaw=Number(p.yaw)||0;scene.add(m);others.set(p.id,m);updateOnline();if(p.gear){applyCharacterGear(m,p.gear);aura(m,p.gear)}}
function updateOnline(){document.getElementById("online").textContent=(others.size+1)+" пират(ов) онлайн"}
socket.on("welcome",d=>{myId=d.id;d.players.filter(p=>p.id!==myId).forEach(addOther);updateOnline();toast("Добро пожаловать на Гранд-лайн")});
socket.on("player-joined",p=>{addOther(p);toast("Новый пират присоединился")});
socket.on("player-moved",p=>{const m=others.get(p.id);if(m){m.userData.target=new THREE.Vector3(p.x,0,p.z);m.userData.targetYaw=Number(p.yaw)||0;if(m.userData.gear!==p.gear){applyCharacterGear(m,p.gear);aura(m,p.gear)}}});
socket.on("stamina",d=>updateStamina(d.stamina));socket.on("player-stance",d=>{const m=others.get(d.id);if(m){m.userData.blocking=d.blocking;m.userData.haki=d.haki;setCharacterHaki(m,!!d.haki)}});socket.on("player-dodged",d=>{const m=others.get(d.id);if(m){m.position.set(d.x,0,d.z);dashEffect(m.position,0x9bdcff)}});socket.on("dodged",d=>{local.position.set(d.x,0,d.z);updateStamina(d.stamina);dashEffect(local.position,0xffffff)});socket.on("player-left",id=>{const m=others.get(id);if(m){scene.remove(m);others.delete(id);updateOnline()}});
socket.on("player-attack",d=>{const attacker=d.id===myId?local:others.get(d.id);if(attacker){attacker.userData.attackMotion={kind:d.kind,started:performance.now(),duration:d.kind==="kong"?520:d.kind==="redhawk"?430:d.kind==="gatling"?115:260,combo:d.combo||1};}if(d.id!==myId){const col=d.kind==="redhawk"?0xff321f:d.gear===5?0xffffff:d.gear===4?0x9d5cff:0xffa04a;const fx=new THREE.Mesh(new THREE.SphereGeometry(d.kind==="kong"?1:.48,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.72}));fx.position.set(d.x+Math.sin(d.yaw)*1.1,1.4,d.z+Math.cos(d.yaw)*1.1);scene.add(fx);effects.push({mesh:fx,dir:new THREE.Vector3(Math.sin(d.yaw),0,Math.cos(d.yaw)),life:22,speed:.5});}});
socket.on("got-hit",d=>{hp=d.hp;updateHealth();if(d.blocked)toast("БЛОК · УРОН СНИЖЕН");local.userData.hitFlash=.18;toast("ПОПАДАНИЕ · -"+Math.round(d.damage)+" HP");if(hp<=0){toast("ТЫ ПРОИГРАЛ · ВОЗРОЖДЕНИЕ");setTimeout(()=>socket.emit("respawn"),1800)}});
socket.on("stats",p=>{hp=p.hp;local.position.set(p.x,0,p.z);updateHealth();if(p.stamina!==undefined)updateStamina(p.stamina);setBlockVisual(!!p.blocking);setHakiVisual(!!p.haki)});socket.on("player-respawned",p=>{const m=others.get(p.id);if(m){m.position.set(p.x,0,p.z)}});
function updateHealth(){document.getElementById("hpText").textContent=hp+" / 100";document.getElementById("hpBar").style.width=hp+"%"}
let stamina=100,blocking=false,hakiOn=false,attackAnimUntil=0;function updateStamina(v){stamina=v;const el=document.getElementById("staminaBar");if(el)el.style.width=v+"%";const t=document.getElementById("staminaText");if(t)t.textContent=Math.round(v)+"%"}function setBlockVisual(v){blocking=v;document.getElementById("blockBtn")?.classList.toggle("selected",v)}function setHakiVisual(v){hakiOn=v;document.getElementById("hakiBtn")?.classList.toggle("selected",v);setCharacterHaki(local,v);aura(local,gear)}function dashEffect(pos,color){const r=new THREE.Mesh(new THREE.TorusGeometry(.85,.06,8,24),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));r.rotation.x=Math.PI/2;r.position.copy(pos);r.position.y=.15;scene.add(r);effects.push({mesh:r,dir:new THREE.Vector3(),life:20,speed:0})}function setBlock(v){blocking=v;socket.emit("stance",{action:"block",enabled:v});setBlockVisual(v)}function toggleHaki(){hakiOn=!hakiOn;if(hakiOn&&stamina<10){hakiOn=false;toast("НЕДОСТАТОЧНО ВЫНОСЛИВОСТИ");return}socket.emit("stance",{action:"haki",enabled:hakiOn});setHakiVisual(hakiOn);toast(hakiOn?"ВООРУЖЕНИЕ ХАКИ ВКЛЮЧЕНО":"ХАКИ ВЫКЛЮЧЕНО")}function dodge(){if(stamina<18){toast("НЕДОСТАТОЧНО ВЫНОСЛИВОСТИ");return}blocking=false;setBlockVisual(false);socket.emit("dodge",{yaw})}
function attack(kind="pistol"){const now=performance.now();if(now<attackLock)return;const cd={pistol:280,gatling:105,kong:950,redhawk:700,rifle:580}[kind];attackLock=now+cd;combo=comboTimer>now?combo%3+1:1;comboTimer=now+850;const rig=local.userData.rig,arm=rig.arms[1];arm.rotation.x=-1.65;arm.rotation.z=-.38;attackAnimUntil=performance.now()+240;local.userData.attackMotion={kind,started:performance.now(),duration:kind==="gatling"?115:kind==="kong"?520:kind==="redhawk"?430:260,combo};
 const n=gear,color=n===5?0xffffff:n===4?0x9d5cff:n===3?0xffc15a:kind==="redhawk"?0xff321f:0xff7a39;
 const size=kind==="kong"?1.1:kind==="gatling"?.34:.55;const orb=new THREE.Mesh(new THREE.SphereGeometry(size,20,16),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.84}));orb.position.copy(local.position).add(new THREE.Vector3(Math.sin(yaw)*1.15,1.45,Math.cos(yaw)*1.15));scene.add(orb);
 const dir=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));effects.push({mesh:orb,dir,life:kind==="gatling"?13:28,speed:kind==="kong"?.72:.95});
 const ring=new THREE.Mesh(new THREE.TorusGeometry(kind==="kong"?1.25:.55,.055,8,28),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8}));ring.position.copy(orb.position);ring.rotation.x=Math.PI/2;scene.add(ring);effects.push({mesh:ring,dir:new THREE.Vector3(),life:14,speed:0});
 socket.emit("attack",{kind,yaw,combo,air:!onGround});}
document.getElementById("specialBtn").onclick=()=>{if(!unlockedSkills.includes("conqueror"))return;if(stamina<32){toast("НУЖНО 32 ВЫНОСЛИВОСТИ");return}socket.emit("special",{});updateStamina(stamina-32);toast("КOРОЛЕВСКОЕ ХАКИ!");};document.getElementById("pistol").onclick=()=>attack("pistol");document.getElementById("redhawk").onclick=()=>attack("redhawk");document.getElementById("gatling").onclick=()=>attack("gatling");document.getElementById("kong").onclick=()=>attack("kong");
let lookPointer=null,lookX=0,lookY=0,lookTravel=0;
renderer.domElement.style.touchAction="none";
renderer.domElement.addEventListener("pointerdown",e=>{if(e.button!==0)return;lookPointer=e.pointerId;lookX=e.clientX;lookY=e.clientY;lookTravel=0;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener("pointermove",e=>{if(lookPointer!==e.pointerId)return;const mx=e.clientX-lookX,my=e.clientY-lookY;lookX=e.clientX;lookY=e.clientY;lookTravel+=Math.hypot(mx,my);cameraYaw-=mx*.008;cameraPitch=THREE.MathUtils.clamp(cameraPitch+my*.006,.22,.95)});
function finishLook(e){if(lookPointer!==e.pointerId)return;if(lookTravel<9)attack("pistol");lookPointer=null}
renderer.domElement.addEventListener("pointerup",finishLook);renderer.domElement.addEventListener("pointercancel",e=>{if(lookPointer===e.pointerId)lookPointer=null});
addEventListener("keydown",e=>{const k=e.key.toLowerCase();keys[k]=true;if([" ","arrowup","arrowdown","arrowleft","arrowright"].includes(k))e.preventDefault();if(["1","2","3","4"].includes(e.key))setGear(+e.key+1);if(k==="g")attack("gatling");if(k==="h")attack("kong");if(k==="f")attack("redhawk");if(k==="v")document.getElementById("specialBtn").click();if(k==="r")attack("rifle");if(k==="q")setBlock(true);if(k==="e")toggleHaki();if(k==="shift")dodge()});
addEventListener("keyup",e=>{keys[e.key.toLowerCase()]=false;if(e.key.toLowerCase()==="q")setBlock(false)});addEventListener("blur",()=>{for(const k in keys)keys[k]=false;joy={x:0,y:0};touching=false});
let joy={x:0,y:0},touching=false;const stick=document.getElementById("stick"),knob=document.getElementById("knob");
function joyMove(e){const r=stick.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),l=Math.hypot(dx,dy),max=36;if(l>max){dx=dx/l*max;dy=dy/l*max}joy.x=dx/max;joy.y=dy/max;knob.style.transform="translate("+dx+"px,"+dy+"px)"}
stick.addEventListener("pointerdown",e=>{e.preventDefault();touching=true;stick.setPointerCapture(e.pointerId);joyMove(e)});stick.addEventListener("pointermove",e=>{if(touching)joyMove(e)});const stopJoy=()=>{touching=false;joy={x:0,y:0};knob.style.transform="translate(0,0)"};stick.addEventListener("pointerup",stopJoy);stick.addEventListener("pointercancel",stopJoy);stick.addEventListener("lostpointercapture",stopJoy);
document.getElementById("mSpecial").onclick=()=>document.getElementById("specialBtn").click();document.getElementById("unlockConqueror").onclick=()=>socket.emit("unlock-skill","conqueror");document.getElementById("unlockWill").onclick=()=>socket.emit("unlock-skill","will");document.getElementById("skillTreeBtn").onclick=()=>document.getElementById("skillModal").classList.toggle("open");document.getElementById("closeSkills").onclick=()=>document.getElementById("skillModal").classList.remove("open");
document.getElementById("mJump").onclick=()=>{if(onGround){velocityY=8.5;onGround=false}};document.getElementById("mAttack").onclick=()=>attack("pistol");document.getElementById("mBlock").addEventListener("pointerdown",()=>setBlock(true));document.getElementById("mBlock").addEventListener("pointerup",()=>setBlock(false));document.getElementById("mBlock").addEventListener("pointerleave",()=>setBlock(false));document.getElementById("mHaki").onclick=toggleHaki;document.getElementById("mDodge").onclick=dodge;document.getElementById("blockBtn").addEventListener("pointerdown",()=>setBlock(true));document.getElementById("blockBtn").addEventListener("pointerup",()=>setBlock(false));document.getElementById("blockBtn").addEventListener("pointerleave",()=>setBlock(false));document.getElementById("hakiBtn").onclick=toggleHaki;document.getElementById("dodgeBtn").onclick=dodge;
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime,now=performance.now(),rig=local.userData.rig;
 const strafe=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;const forward=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-joy.y;
 let dx=Math.cos(cameraYaw)*strafe+Math.sin(cameraYaw)*forward,dz=-Math.sin(cameraYaw)*strafe+Math.cos(cameraYaw)*forward,len=Math.hypot(dx,dz);
 if(len>1){dx/=len;dz/=len}
 const moving=len>.08,step=moving?Math.sin(t*11):0,speed=gear===4?8.5:gear===5?7.5:gear===3?5.2:6.5;
 local.position.x=THREE.MathUtils.clamp(local.position.x+dx*speed*dt,-43,43);
 local.position.z=THREE.MathUtils.clamp(local.position.z+dz*speed*dt,-43,43);
 if(moving){yaw=Math.atan2(dx,dz);local.rotation.y=THREE.MathUtils.lerp(local.rotation.y,yaw,.22)}
 const wasGrounded=onGround;
 if((keys[" "]||keys.space)&&onGround){velocityY=8.5;onGround=false}
 if(!onGround){local.position.y+=velocityY*dt;velocityY-=22*dt;if(local.position.y<=0){local.position.y=0;velocityY=0;onGround=true}}
 if(!wasGrounded&&onGround)local.userData.landPulse=1;if(!wasGrounded&&onGround){const shock=new THREE.Mesh(new THREE.RingGeometry(.25,1.05,32),new THREE.MeshBasicMaterial({color:gear===5?0xffffff:0xe7b94e,transparent:true,opacity:.7,side:THREE.DoubleSide}));shock.rotation.x=-Math.PI/2;shock.position.set(local.position.x,.04,local.position.z);scene.add(shock);effects.push({mesh:shock,dir:new THREE.Vector3(),life:18,speed:0});}
 local.userData.landPulse=Math.max(0,(local.userData.landPulse||0)-dt*2.8);
 const land=local.userData.landPulse||0,air=onGround?0:1;
 // Body bounce, squash and stretch on take-off / landing.
 rig.torso.position.y=1.35+(onGround?Math.abs(Math.sin(t*(moving?22:2)))*.025:Math.sin(t*9)*.045);
 rig.torso.scale.y=1+air*.09-land*.12;rig.torso.scale.x=1-air*.045+land*.06;rig.torso.scale.z=1-air*.045+land*.06;
 local.scale.y=(gear===3?1.08:gear===4?1.1:1)*(1+air*.035+land*.035);
 const motion=local.userData.attackMotion,age=motion?(now-motion.started)/motion.duration:2,pulse=motion&&age<1?Math.sin(Math.max(0,age)*Math.PI):0;
 let leftArm=0,rightArm=0,armStretch=1,torsoTwist=0;
 if(blocking){leftArm=-1.05;rightArm=-1.05}
 else if(pulse>0){
  if(motion.kind==="gatling"){const rapid=Math.sin(age*Math.PI*9);rightArm=-Math.max(0,rapid)*1.8;leftArm=-Math.max(0,-rapid)*1.8;armStretch=1+Math.abs(rapid)*.42}
  else {const power=motion.kind==="kong"?1.55:motion.kind==="redhawk"?1.3:1;rightArm=-1.65*pulse*power;leftArm=.2*pulse;armStretch=1+(motion.kind==="kong"?.95:motion.kind==="redhawk"?.62:.28)*pulse;torsoTwist=Math.sin(age*Math.PI)*.32}
 }
 rig.arms[0].rotation.x=THREE.MathUtils.lerp(rig.arms[0].rotation.x,leftArm+(moving?-.32*step:0),.35);
 rig.arms[1].rotation.x=THREE.MathUtils.lerp(rig.arms[1].rotation.x,rightArm+(moving?.32*step:0),.42);
 rig.arms[0].rotation.z=THREE.MathUtils.lerp(rig.arms[0].rotation.z,blocking?.25:moving?Math.sin(t*11)*.06:0,.28);
 rig.arms[1].rotation.z=THREE.MathUtils.lerp(rig.arms[1].rotation.z,blocking?-.25:pulse>0?-.38*pulse:moving?-Math.sin(t*11)*.06:0,.32);
 rig.arms[1].scale.y=THREE.MathUtils.lerp(rig.arms[1].scale.y,armStretch,.32);
 rig.arms[0].scale.y=THREE.MathUtils.lerp(rig.arms[0].scale.y,1+(pulse>0?.12*pulse:0),.3);
 rig.torso.rotation.y=THREE.MathUtils.lerp(rig.torso.rotation.y,torsoTwist,.28);
 rig.torso.rotation.z=THREE.MathUtils.lerp(rig.torso.rotation.z,moving?Math.sin(t*11)*.035:0,.22);
 rig.legs[0].rotation.x=onGround?step*.48:-.48;rig.legs[1].rotation.x=onGround?-step*.48:.58;
 rig.legs.forEach((leg,i)=>{leg.rotation.z=onGround&&moving?(i===0?-.035:.035):0});
 rig.head.rotation.y=Math.sin(t*1.4)*.035;rig.head.rotation.x=air?-.12:0;
 // Gear-specific idle and transformation motion.
 if(gear===5){rig.cloudRing.rotation.z=t*.55;rig.cloudRing.scale.setScalar(1+.045*Math.sin(t*4));rig.gear5.rotation.y=Math.sin(t*1.7)*.025;rig.gear5.position.y=1.48+Math.sin(t*3.2)*.055;rig.whiteHair.rotation.z=Math.sin(t*2.4)*.035}
 if(gear===3){rig.giantArm.rotation.z=-.15+Math.sin(t*2)*.035;rig.giantArm.rotation.x=Math.sin(t*1.6)*.045;rig.giantArm.scale.set(1,1+(pulse>0?.18*pulse:0),1)}
 if(gear===4){rig.gear4.rotation.y=Math.sin(t*2)*.025;rig.gear4Arms.forEach((a,i)=>{a.rotation.z=Math.sin(t*3+i*Math.PI)*.12;a.rotation.x=Math.cos(t*2.5+i*Math.PI)*.08})}
 bossRoot.rotation.y=Math.sin(t*.7)*.18;bossRoot.position.y=bossPhase==="windup"?.08*Math.sin(t*24):Math.sin(t*2)*.035;
 if(local.userData.hitFlash>0){local.userData.hitFlash-=dt;local.traverse(o=>{if(o.isMesh&&o.material?.emissive){o.material.emissive.setHex(0xff2222);o.material.emissiveIntensity=.5}})}
 for(const m of others.values()){
  if(m.userData.target){m.position.lerp(m.userData.target,.2);if(Number.isFinite(m.userData.targetYaw)){const da=Math.atan2(Math.sin(m.userData.targetYaw-m.rotation.y),Math.cos(m.userData.targetYaw-m.rotation.y));m.rotation.y+=da*.2}}
  const rr=m.userData.rig;if(!rr)continue;
  const otherMoving=m.userData.target&&m.position.distanceTo(m.userData.target)>.025,otherStep=otherMoving?Math.sin(t*9)*.3:Math.sin(t*1.8)*.018;
  rr.legs[0].rotation.x=otherStep;rr.legs[1].rotation.x=-otherStep;
  const am=m.userData.attackMotion,aa=am?(now-am.started)/am.duration:2,ap=am&&aa<1?Math.sin(Math.max(0,aa)*Math.PI):0;
  if(m.userData.blocking){rr.arms[0].rotation.x=-1.05;rr.arms[1].rotation.x=-1.05}
  else if(ap>0){rr.arms[1].rotation.x=-1.6*ap;rr.arms[1].scale.y=1+.45*ap;rr.torso.rotation.y=Math.sin(aa*Math.PI)*.22}
  else {rr.arms[0].rotation.x=-otherStep*.65;rr.arms[1].rotation.x=otherStep*.65;rr.arms[1].scale.y=THREE.MathUtils.lerp(rr.arms[1].scale.y,1,.25)}
  if(m.userData.gear===5){rr.cloudRing.rotation.z=t*.5;rr.gear5.position.y=1.48+Math.sin(t*3)*.045}
  else if(m.userData.gear===3)rr.giantArm.rotation.z=-.15+Math.sin(t*2)*.03;
  else if(m.userData.gear===4)rr.gear4.rotation.y=Math.sin(t*2)*.02;
 }
 if(t-lastSend>.06){socket.emit("move",{x:local.position.x,y:local.position.y,z:local.position.z,yaw,gear});lastSend=t}
 for(let i=effects.length-1;i>=0;i--){const f=effects[i];f.mesh.position.addScaledVector(f.dir,f.speed);f.life--;f.mesh.scale.multiplyScalar(1.035);if(f.life<=0){scene.remove(f.mesh);effects.splice(i,1)}}
 const horizontal=Math.cos(cameraPitch)*cameraDistance,vertical=Math.sin(cameraPitch)*cameraDistance;const target=new THREE.Vector3(local.position.x-Math.sin(cameraYaw)*horizontal,local.position.y+1.35+vertical,local.position.z-Math.cos(cameraYaw)*horizontal);
 camera.position.lerp(target,.16);camera.lookAt(local.position.x,local.position.y+1.35,local.position.z);renderer.render(scene,camera)
}
animate();addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
