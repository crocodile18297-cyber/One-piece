import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/*
 * Grand Arena character workshop.
 * Four distinct silhouettes share a transform rig so existing multiplayer
 * movement and combat code can drive every form.
 */
export function createPirate() {
  const root = new THREE.Group();
  root.name = "GrandArena_Luffy_4Forms";
  const material = (color, roughness=.68, metalness=0, extra={}) =>
    new THREE.MeshStandardMaterial({color,roughness,metalness,...extra});
  const M = {
    skin:material(0xf3bc91,.72), skinLight:material(0xffd5ad,.72),
    skinShade:material(0xc98261,.78), blush:material(0xd98675,.85),
    hair:material(0x17191d,.48), hairHi:material(0x34343a,.5),
    eyeWhite:material(0xfff7e9,.32), iris:material(0x4a2d20,.28),
    pupil:material(0x11151a,.18), mouth:material(0x54212a,.65),
    teeth:material(0xfff8df,.28), tongue:material(0xe45e68,.42),
    red:material(0xc92e29,.7), redDark:material(0x7e1c20,.74),
    redLight:material(0xed5746,.55), denim:material(0x2462a4,.82),
    denimDark:material(0x123d73,.82), denimLight:material(0x4c89c8,.72),
    straw:material(0xe7b957,.85), strawLight:material(0xffd878,.82),
    strawDark:material(0x9b672f,.85), hatBand:material(0xb8272b,.72),
    yellow:material(0xf2c34d,.62), gold:material(0xe9b64d,.3,.62),
    dark:material(0x202229,.58), sandal:material(0x38241d,.78),
    sole:material(0x211b1a,.9), white:material(0xf6f2e9,.85),
    whiteHi:material(0xffffff,.58), cloud:material(0xf8f7f2,.86),
    cloudShade:material(0xd8e1e4,.86), blackHaki:material(0x171820,.28,.2),
    hakiHi:material(0x45404f,.31,.25), purple:material(0x56359a,.56,.16),
    purpleHi:material(0x9c67ed,.45,.16), flame:material(0xff5529,.34,.08,{emissive:0xa91c08,emissiveIntensity:.42}),
    flameGold:material(0xffc44f,.35,.06,{emissive:0xb86b12,emissiveIntensity:.3}),
    lightning:material(0xb7f7ff,.24,.12,{emissive:0x45b9eb,emissiveIntensity:1.15}),
    whiteGlow:material(0xffffff,.25,.04,{emissive:0xdcecff,emissiveIntensity:.48}),
    seam:material(0x5f2520,.72), stitch:material(0xffd986,.7)
  };

  const put = (parent, geometry, mat, position=[0,0,0], scale=[1,1,1], rotation=[0,0,0]) => {
    const object = new THREE.Mesh(geometry,mat);
    object.position.set(...position); object.scale.set(...scale);
    object.rotation.set(...rotation);
    object.castShadow=true; object.receiveShadow=true;
    parent.add(object); return object;
  };
  const sphere = (parent,mat,pos,scale,segments=28) =>
    put(parent,new THREE.SphereGeometry(1,segments,Math.max(16,Math.floor(segments*.72))),mat,pos,scale);
  const box = (parent,mat,pos,scale,rotation=[0,0,0]) =>
    put(parent,new THREE.BoxGeometry(1,1,1),mat,pos,scale,rotation);
  const torus = (parent,mat,pos,major,minor,rotation=[0,0,0],segments=64) =>
    put(parent,new THREE.TorusGeometry(major,minor,12,segments),mat,pos,[1,1,1],rotation);
  const tube = (parent,mat,points,radius,segments=64,closed=false) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed,"catmullrom",.5);
    return put(parent,new THREE.TubeGeometry(curve,segments,radius,8,closed),mat);
  };
  const segment = (parent,mat,a,b,r1,r2=r1,radial=16) => {
    const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
    const object=put(parent,new THREE.CylinderGeometry(r2,r1,d.length(),radial,1),mat,A.clone().add(B).multiplyScalar(.5).toArray());
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    sphere(parent,mat,a,[r1,r1,r1],radial);
    sphere(parent,mat,b,[r2,r2,r2],radial);
    return object;
  };
  const spike = (parent,mat,base,tip,radius) => {
    const A=new THREE.Vector3(...base),B=new THREE.Vector3(...tip),d=B.clone().sub(A);
    const object=put(parent,new THREE.ConeGeometry(radius,d.length(),12,2),mat,A.clone().add(B).multiplyScalar(.5).toArray());
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    return object;
  };
  const puff = (parent,mat,pos,scale=[.16,.16,.16]) => sphere(parent,mat,pos,scale,22);
  const addStitches = (parent,mat,rx,rz,y,count=32,zOffset=0) => {
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2;
      sphere(parent,mat,[Math.cos(a)*rx,y,Math.sin(a)*rz+zOffset],[.012,.009,.012],8);
    }
  };

  // Main body rig and anatomy.
  const rig={isGLB:false,materials:{skin:M.skin,armament:M.blackHaki},armParts:[],fists:[],shoulders:[],legs:[],arms:[],hairSpikes:[]};
  rig.torso=new THREE.Group(); rig.torso.position.y=1.42; root.add(rig.torso);
  sphere(rig.torso,M.skin,[0,.02,0],[.405,.58,.285],40);
  sphere(rig.torso,M.skinLight,[0,.35,.005],[.34,.29,.265],32);
  sphere(rig.torso,M.skinShade,[0,-.31,-.005],[.36,.22,.255],30);
  // Pectorals, clavicles, ribs and sculpted abdominal plates.
  for(const side of [-1,1]){
    sphere(rig.torso,M.skin,[side*.185,.22,.205],[.205,.185,.12],28);
    sphere(rig.torso,M.skinLight,[side*.17,.43,.13],[.19,.045,.045],20);
    sphere(rig.torso,M.skinShade,[side*.33,-.02,.12],[.055,.2,.065],20);
    sphere(rig.torso,M.skin,[side*.135,-.02,.235],[.115,.095,.055],22);
    sphere(rig.torso,M.skin,[side*.135,-.17,.222],[.105,.085,.05],22);
    sphere(rig.torso,M.skin,[side*.135,-.31,.205],[.09,.068,.046],22);
    tube(rig.torso,M.skinShade,[[side*.02,.12,.264],[side*.02,-.04,.286],[side*.02,-.2,.26]],.009,18);
  }
  tube(rig.torso,M.skinShade,[[-.3,.38,.13],[0,.48,.16],[.3,.38,.13]],.012,32);
  tube(rig.torso,M.skinShade,[[0,.16,.282],[0,-.37,.245]],.009,24);

  // Open red vest: separate tailored panels, lapels, hems, seams and buttons.
  rig.vest=new THREE.Group(); rig.torso.add(rig.vest);
  for(const side of [-1,1]){
    const panel=sphere(rig.vest,M.red,[side*.205,.105,.225],[.19,.39,.105],32);
    panel.rotation.z=side*.04;
    const lapel=box(rig.vest,M.redDark,[side*.115,.34,.314],[.105,.42,.035],[0,0,side*.23]);
    const lapelHi=box(rig.vest,M.redLight,[side*.18,.32,.329],[.026,.35,.012],[0,0,side*.23]);
    tube(rig.vest,M.redDark,[[side*.37,.35,.24],[side*.38,.08,.27],[side*.31,-.21,.27]],.012,24);
    for(let i=0;i<4;i++) sphere(rig.vest,M.gold,[side*.08,-.15+i*.13,.34],[.019,.019,.012],10);
    // Stitch line on the outer vest seam.
    for(let i=0;i<9;i++) sphere(rig.vest,M.stitch,[side*(.34+.025*Math.sin(i*.4)), -.2+i*.065,.284],[.008,.012,.008],7);
  }
  sphere(rig.vest,M.redDark,[0,-.29,.19],[.31,.055,.105],24);
  // Waist wrap, folded golden sash, knot and hanging tails.
  torus(rig.torso,M.yellow,[0,-.385,0],.365,.075,[Math.PI/2,0,0],64);
  torus(rig.torso,M.gold,[0,-.385,0],.37,.018,[Math.PI/2,0,0],64);
  sphere(rig.torso,M.yellow,[.04,-.37,.335],[.15,.12,.075],24);
  sphere(rig.torso,M.gold,[.04,-.37,.398],[.055,.045,.018],16);
  const sashTail=tube(rig.torso,M.yellow,[[.08,-.38,.33],[.25,-.48,.37],[.37,-.64,.3],[.44,-.78,.22]],.055,32);
  const sashTail2=tube(rig.torso,M.yellow,[[-.02,-.4,.33],[-.2,-.52,.35],[-.24,-.69,.29],[-.18,-.82,.22]],.042,32);
  tube(rig.torso,M.gold,[[.12,-.42,.375],[.25,-.52,.39],[.37,-.66,.32]],.009,20);

  // Shorts and raised stitched cuffs.
  rig.shorts=new THREE.Group(); root.add(rig.shorts);
  sphere(rig.shorts,M.denim,[0,.91,0],[.385,.24,.29],36);
  for(const side of [-1,1]){
    sphere(rig.shorts,M.denim,[side*.18,.72,.015],[.19,.25,.275],30);
    torus(rig.shorts,M.denimDark,[side*.18,.55,0],.175,.028,[Math.PI/2,0,0],40);
    for(let i=0;i<7;i++) sphere(rig.shorts,M.denimLight,[side*.18-.12+i*.04,.55,.275],[.009,.009,.008],7);
    tube(rig.shorts,M.denimDark,[[side*.31,.93,.23],[side*.33,.77,.24],[side*.32,.58,.23]],.012,20);
    box(rig.shorts,M.denimDark,[side*.29,.77,.276],[.09,.1,.025],[0,0,side*.12]);
    for(let i=0;i<3;i++) sphere(rig.shorts,M.stitch,[side*.29-.025+i*.025,.76,.294],[.007,.007,.006],7);
  }
  box(rig.shorts,M.gold,[0,.91,.292],[.15,.13,.035]);
  box(rig.shorts,M.strawDark,[0,.91,.315],[.075,.065,.012]);

  // Articulated legs with thigh and calf forms, knees, ankles and detailed sandals.
  for(const side of [-1,1]){
    const leg=new THREE.Group(); leg.position.set(side*.19,.72,0); root.add(leg); rig.legs.push(leg);
    sphere(leg,M.skin,[0,-.12,0],[.155,.24,.16],26);
    sphere(leg,M.skinLight,[side*-.025,-.12,.112],[.09,.18,.052],20);
    sphere(leg,M.skinShade,[0,-.29,.02],[.13,.07,.13],18);
    sphere(leg,M.skin,[0,-.48,.005],[.115,.21,.125],24);
    sphere(leg,M.skinLight,[side*.025,-.48,.09],[.07,.15,.045],18);
    torus(leg,M.skinShade,[0,-.64,0],.106,.018,[Math.PI/2,0,0],24);
    // Sandal sole, footbed, straps and toe details.
    box(leg,M.sole,[0,-.68,.075],[.27,.055,.42]);
    box(leg,M.sandal,[0,-.645,.07],[.255,.035,.39]);
    tube(leg,M.strawDark,[[-.105,-.62,.23],[0,-.61,.1],[.105,-.62,.23]],.025,18);
    tube(leg,M.sandal,[[0,-.62,.23],[0,-.61,.12],[side*.07,-.61,.04]],.018,16);
    for(let i=0;i<5;i++) sphere(leg,M.skin,[side*-.07+i*.035,-.62,.265],[.018,.018,.035],10);
    for(let i=0;i<8;i++) sphere(leg,M.gold,[side*-.1+i*.028,-.67,.26],[.006,.006,.006],6);
  }

  // Arms built as shoulder pivots with elbow, forearm, wrist and five-finger hands.
  function makeHand(parent,scale=1,skinMat=M.skin){
    const hand=new THREE.Group(); parent.add(hand);
    sphere(hand,skinMat,[0,0,0],[.115*scale,.115*scale,.09*scale],24);
    for(let i=0;i<4;i++){
      const x=(i-1.5)*.052*scale, length=(.105+(.02-Math.abs(i-1.5)*.008))*scale;
      segment(hand,skinMat,[x,-.025*scale,.015*scale],[x*1.08,-length,.055*scale],.024*scale,.018*scale,10);
      sphere(hand,M.skinLight,[x*1.08,-length,.074*scale],[.012*scale,.012*scale,.008*scale],8);
    }
    const thumb=new THREE.Group(); thumb.position.set(.105*scale,-.005*scale,0); hand.add(thumb);
    segment(thumb,skinMat,[0,0,0],[.065*scale,-.07*scale,.045*scale],.032*scale,.022*scale,10);
    sphere(thumb,skinMat,[.065*scale,-.07*scale,.045*scale],[.025*scale,.027*scale,.023*scale],10);
    return hand;
  }
  for(const side of [-1,1]){
    const arm=new THREE.Group(); arm.position.set(side*.455,.48,0); rig.torso.add(arm); rig.arms.push(arm);
    const shoulder=sphere(arm,M.skin,[0,-.055,0],[.19,.19,.18],28);
    sphere(arm,M.skinLight,[side*.04,-.08,.12],[.13,.12,.07],20);
    const upper=sphere(arm,M.skin,[side*.012,-.23,.005],[.145,.245,.145],28);
    const bicep=sphere(arm,M.skinLight,[side*.045,-.22,.105],[.095,.18,.07],22);
    const elbow=sphere(arm,M.skinShade,[0,-.405,.015],[.12,.12,.12],20);
    const fore=sphere(arm,M.skin,[side*.008,-.56,.02],[.135,.235,.14],28);
    sphere(arm,M.skinLight,[side*.02,-.55,.125],[.085,.18,.055],20);
    const wrist=torus(arm,M.skinShade,[0,-.735,.025],.105,.016,[Math.PI/2,0,0],24);
    const hand=makeHand(arm,1,M.skin); hand.position.set(0,-.82,.055);
    rig.armParts.push(upper,fore); rig.fists.push(hand); rig.shoulders.push(shoulder);
    arm.userData={upper,fore,elbow,hand};
  }

  // Neck and head pivot.
  sphere(rig.torso,M.skin,[0,.68,0],[.14,.19,.14],24);
  rig.head=new THREE.Group(); rig.head.position.set(0,.84,.015); rig.torso.add(rig.head);
  sphere(rig.head,M.skin,[0,0,0],[.315,.385,.285],40);
  sphere(rig.head,M.skinLight,[0,-.09,.105],[.27,.22,.22],32);
  // Jawline and ears.
  for(const side of [-1,1]){
    sphere(rig.head,M.skin,[side*.29,-.04,0],[.075,.105,.095],18);
    sphere(rig.head,M.skinShade,[side*.315,-.04,.03],[.035,.055,.045],12);
    sphere(rig.head,M.skinLight,[side*.27,-.04,.055],[.018,.038,.018],10);
  }
  // Eyes with iris rings, pupils, reflected highlights and brows.
  for(const side of [-1,1]){
    sphere(rig.head,M.eyeWhite,[side*.12,.035,.254],[.075,.092,.042],24);
    sphere(rig.head,M.iris,[side*.12,.025,.291],[.036,.054,.018],20);
    sphere(rig.head,M.pupil,[side*.12,.022,.306],[.018,.036,.012],16);
    sphere(rig.head,M.whiteGlow,[side*.132,.048,.318],[.011,.014,.007],10);
    tube(rig.head,M.hair,[[side*.205,.13,.246],[side*.125,.155,.282],[side*.045,.13,.27]],.017,20);
    tube(rig.head,M.skinShade,[[side*.20,-.025,.25],[side*.13,-.08,.28],[side*.055,-.06,.285]],.008,16);
  }
  // Nose, mouth, teeth and signature small scar beneath left eye.
  sphere(rig.head,M.skinShade,[0,-.045,.29],[.026,.052,.026],16);
  sphere(rig.head,M.skinLight,[0,-.072,.303],[.018,.016,.009],10);
  tube(rig.head,M.mouth,[[-.105,-.185,.254],[-.06,-.215,.275],[0,-.225,.28],[.07,-.21,.27],[.11,-.18,.25]],.014,22);
  for(let i=0;i<5;i++) box(rig.head,M.teeth,[-.065+i*.032,-.198,.285],[.022,.024,.008]);
  tube(rig.head,M.redDark,[[.11,-.025,.284],[.16,-.06,.286],[.19,-.10,.27]],.009,16);
  tube(rig.head,M.skinShade,[[-.19,-.02,.275],[-.16,-.07,.294],[-.13,-.12,.288]],.008,14);

  // Black hair cap and separated pointed locks.
  rig.hair=new THREE.Group(); rig.head.add(rig.hair);
  sphere(rig.hair,M.hair,[0,.215,-.015],[.32,.205,.275],34);
  for(let i=0;i<13;i++){
    const a=i/13*Math.PI*2, bx=Math.cos(a)*.245, bz=Math.sin(a)*.21;
    const tip=[bx+Math.cos(a)*.12,.19+(.09*Math.sin(i*2.1)),bz+Math.sin(a)*.15];
    spike(rig.hair,i%3===0?M.hairHi:M.hair,[bx,.23,bz],tip,.075);
    sphere(rig.hair,M.hair,[bx,.22,bz],[.085,.07,.08],14);
  }
  // Iconic straw hat, woven rings, band, seam and stitched brim.
  rig.hat=new THREE.Group(); rig.head.add(rig.hat);
  put(rig.hat,new THREE.CylinderGeometry(.62,.66,.06,64,3),M.straw,[0,.385,0],[1,1,.92]);
  put(rig.hat,new THREE.CylinderGeometry(.29,.34,.27,40,3),M.strawLight,[0,.53,-.005]);
  torus(rig.hat,M.hatBand,[0,.49,0],.315,.035,[Math.PI/2,0,0],48);
  torus(rig.hat,M.strawDark,[0,.416,0],.51,.008,[Math.PI/2,0,0],64);
  torus(rig.hat,M.strawLight,[0,.557,0],.31,.012,[Math.PI/2,0,0],40);
  for(let y=0;y<5;y++){
    const radius=.285-y*.005;
    torus(rig.hat,y%2?M.strawDark:M.strawLight,[0,.43+y*.045,0],radius,.006,[Math.PI/2,0,0],40);
  }
  for(let i=0;i<48;i++){
    const a=i/48*Math.PI*2;
    sphere(rig.hat,M.strawDark,[Math.cos(a)*.57,.416,Math.sin(a)*.525],[.009,.008,.009],7);
  }
  addStitches(rig.hat,M.stitch,.62,.57,.414,48);

  // Gear 2: heat pressure, steam trails and hot highlights around a fast body.
  rig.gear2=new THREE.Group(); root.add(rig.gear2);
  const heatRing=torus(rig.gear2,M.flame,[0,.12,0],.72,.035,[Math.PI/2,0,0],64);
  heatRing.name="Gear2_HeatRing";
  for(let side of [-1,1]){
    tube(rig.gear2,M.flame,[[side*.42,1.15,.02],[side*.68,1.45,.04],[side*.55,1.8,0],[side*.76,2.08,-.03]],.028,36);
    tube(rig.gear2,M.flameGold,[[side*.46,.65,.04],[side*.65,.9,.02],[side*.56,1.17,0]],.018,24);
  }
  for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2;
    tube(rig.gear2,M.whiteGlow,[[Math.cos(a)*.55,.25,Math.sin(a)*.5],[Math.cos(a+1)*.68,.65,Math.sin(a+1)*.52],[Math.cos(a+1.8)*.56,1.05,Math.sin(a+1.8)*.48]],.018,28);
  }

  // Gear 3: giant balloon arm and fist with distinct knuckles, creases and steam.
  rig.gear3=new THREE.Group(); root.add(rig.gear3);
  rig.giantArm=new THREE.Group(); rig.giantArm.position.set(.6,1.82,.02); rig.gear3.add(rig.giantArm);
  sphere(rig.giantArm,M.skin,[0,0,0],[.35,.34,.32],32);
  sphere(rig.giantArm,M.skinLight,[.06,-.27,.045],[.33,.42,.31],34);
  sphere(rig.giantArm,M.skin,[.08,-.57,.12],[.48,.43,.4],36);
  // Massive fist: palm, four curled knuckles and thumb.
  sphere(rig.giantArm,M.skin,[.08,-.86,.22],[.55,.42,.45],36);
  for(let i=0;i<4;i++){
    const x=-.30+i*.245;
    sphere(rig.giantArm,M.skinLight,[x,-.72,.585],[.14,.16,.1],24);
    tube(rig.giantArm,M.skinShade,[[x-.055,-.82,.65],[x,-.87,.68],[x+.055,-.84,.65]],.009,12);
  }
  sphere(rig.giantArm,M.skin,[.52,-.91,.28],[.2,.22,.18],24);
  segment(rig.giantArm,M.skin,[.53,-.91,.3],[.63,-1.08,.48],.105,.075,16);
  torus(rig.giantArm,M.skinShade,[0,-.48,.02],.34,.018,[Math.PI/2,0,0],40);
  // Knuckle creases and vapor puffs for scale.
  for(let i=0;i<3;i++) tube(rig.giantArm,M.skinShade,[[-.2+i*.18,-.96,.58],[-.12+i*.18,-1.0,.65],[-.04+i*.18,-.96,.61]],.012,16);
  rig.gear3Steam=new THREE.Group(); rig.gear3.add(rig.gear3Steam);
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2, x=Math.cos(a)*.58, z=Math.sin(a)*.36;
    puff(rig.gear3Steam,M.cloud,[x,1.7+Math.sin(a*2)*.2,z],[.16,.12,.15]);
  }
  tube(rig.gear3Steam,M.cloud,[[-.05,2.0,-.25],[.35,2.22,-.32],[.72,2.08,-.2],[.9,1.8,-.12]],.055,42);

  // Gear 4: Boundman silhouette — expanded torso, coated arms, patterning and smoke.
  rig.gear4=new THREE.Group(); root.add(rig.gear4);
  sphere(rig.gear4,M.red,[0,1.47,-.02],[.67,.79,.47],44);
  sphere(rig.gear4,M.redLight,[0,1.73,.23],[.48,.42,.22],34);
  for(const side of [-1,1]){
    sphere(rig.gear4,M.red,[side*.43,1.86,0],[.31,.34,.31],30);
    sphere(rig.gear4,M.redDark,[side*.24,1.23,.34],[.20,.21,.09],24);
    // Dark, curved Haki flame markings.
    tube(rig.gear4,M.blackHaki,[[side*.06,1.88,.43],[side*.19,1.72,.46],[side*.24,1.55,.44],[side*.12,1.4,.44]],.04,26);
    tube(rig.gear4,M.hakiHi,[[side*.3,1.9,.31],[side*.43,1.72,.34],[side*.38,1.57,.36]],.018,20);
    sphere(rig.gear4,M.purple,[side*.38,.9,-.01],[.25,.18,.27],24);
  }
  // Inflated dark forearms as independent animated pivots.
  rig.gear4Arms=[];
  for(const side of [-1,1]){
    const arm=new THREE.Group(); arm.position.set(side*.68,1.77,.02); rig.gear4.add(arm); rig.gear4Arms.push(arm);
    sphere(arm,M.blackHaki,[0,-.13,0],[.265,.28,.25],32);
    sphere(arm,M.hakiHi,[side*.035,-.17,.16],[.17,.19,.1],24);
    sphere(arm,M.blackHaki,[0,-.48,.03],[.23,.34,.23],32);
    torus(arm,M.purpleHi,[0,-.56,.02],.22,.035,[Math.PI/2,0,0],32);
    sphere(arm,M.blackHaki,[0,-.78,.09],[.28,.24,.27],32);
    for(let j=0;j<4;j++) sphere(arm,M.hakiHi,[(j-1.5)*.095,-.75,.31],[.055,.075,.035],14);
  }
  // Inflated thighs, purple shorts and belt.
  for(const side of [-1,1]){
    sphere(rig.gear4,M.red,[side*.23,.78,0],[.245,.34,.25],28);
    sphere(rig.gear4,M.blackHaki,[side*.23,.57,.02],[.19,.16,.19],22);
  }
  torus(rig.gear4,M.purple,[0,.99,0],.46,.085,[Math.PI/2,0,0],56);
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    sphere(rig.gear4,M.purpleHi,[Math.cos(a)*.48,1.0,Math.sin(a)*.42],[.025,.035,.025],10);
  }
  // Boundman steam coils.
  rig.gear4Smoke=new THREE.Group(); rig.gear4.add(rig.gear4Smoke);
  tube(rig.gear4Smoke,M.cloud,[[-.65,2.1,0],[-.88,2.32,-.05],[-.4,2.48,-.12],[0,2.42,-.18],[.45,2.5,-.08],[.82,2.28,.0]],.06,80);
  for(let i=0;i<10;i++){
    const a=i/10*Math.PI*2;
    puff(rig.gear4Smoke,i%2?M.cloud:M.cloudShade,[Math.cos(a)*.82,1.95+Math.sin(a)*.25,Math.sin(a)*.34],[.14,.13,.14]);
  }

  // Gear 5: Nika form — white flowing hair, cloud scarf, white coat and sky-lightning.
  rig.gear5=new THREE.Group(); root.add(rig.gear5);
  const nikaCloth=new THREE.Group(); rig.gear5.add(nikaCloth);
  sphere(nikaCloth,M.white,[0,1.42,0],[.46,.62,.33],36);
  for(const side of [-1,1]){
    sphere(nikaCloth,M.whiteHi,[side*.19,1.36,.23],[.2,.48,.13],30);
    tube(nikaCloth,M.cloud,[[side*.29,1.72,.25],[side*.37,1.46,.23],[side*.31,1.16,.21]],.018,28);
    sphere(nikaCloth,M.white,[side*.19,.72,.02],[.22,.28,.23],26);
  }
  torus(nikaCloth,M.red,[0,.95,0],.39,.055,[Math.PI/2,0,0],56);
  // Cloud mantle and asymmetric floating puffs around the shoulders.
  rig.cloudRing=torus(rig.gear5,M.whiteGlow,[0,1.8,0],.72,.12,[Math.PI/2,0,0],72);
  rig.cloudRing.name="Nika_CloudRing";
  rig.cloudMantle=new THREE.Group(); rig.gear5.add(rig.cloudMantle);
  for(let i=0;i<18;i++){
    const a=i/18*Math.PI*2, radius=.57+(.07*Math.sin(i*2.4));
    puff(rig.cloudMantle,i%4===0?M.whiteHi:M.cloud,[Math.cos(a)*radius,1.75+Math.sin(a*2)*.17,Math.sin(a)*.34],[.17+(.025*(i%3)),.15,.15]);
  }
  tube(rig.cloudMantle,M.cloud,[[.55,1.92,.12],[.83,2.12,.04],[.54,2.29,-.1],[.2,2.18,-.18],[-.2,2.3,-.12],[-.58,2.12,0]],.045,72);
  // White hair silhouette built from layered locks and rounded tufts.
  rig.whiteHair=new THREE.Group(); rig.head.add(rig.whiteHair);
  sphere(rig.whiteHair,M.white,[0,.22,-.015],[.34,.23,.29],36);
  for(let i=0;i<18;i++){
    const a=i/18*Math.PI*2, x=Math.cos(a)*.25, z=Math.sin(a)*.22;
    const tip=[x+Math.cos(a)*(.13+.035*Math.sin(i)),.18+.1*Math.sin(i*1.7),z+Math.sin(a)*.14];
    spike(rig.whiteHair,i%3===0?M.whiteHi:M.white,[x,.25,z],tip,.09);
    puff(rig.whiteHair,M.cloud,[x,.22,z],[.085,.085,.085]);
  }
  for(let i=0;i<6;i++){
    const side=i%2?1:-1;
    tube(rig.whiteHair,M.whiteHi,[[side*.16,.29,.08],[side*.28,.12,.09],[side*.34,-.02,.02]],.035,20);
  }
  // Nika's playful smile overlay and bright eye glints.
  rig.nikaSmile=new THREE.Group(); rig.head.add(rig.nikaSmile);
  sphere(rig.nikaSmile,M.mouth,[0,-.18,.264],[.12,.065,.035],24);
  sphere(rig.nikaSmile,M.teeth,[0,-.155,.291],[.095,.022,.012],20);
  sphere(rig.nikaSmile,M.tongue,[0,-.205,.29],[.05,.018,.01],16);
  for(const side of [-1,1]){
    sphere(rig.nikaSmile,M.whiteHi,[side*.12,.04,.29],[.082,.095,.02],20);
    sphere(rig.nikaSmile,M.iris,[side*.12,.035,.31],[.04,.05,.015],18);
    sphere(rig.nikaSmile,M.pupil,[side*.12,.032,.322],[.02,.03,.009],14);
  }
  rig.nikaLightning=new THREE.Group(); rig.gear5.add(rig.nikaLightning);
  for(let i=0;i<5;i++){
    const a=i/5*Math.PI*2, x=Math.cos(a), z=Math.sin(a);
    tube(rig.nikaLightning,M.lightning,[[x*.78,1.2,z*.37],[x*.98,1.42,z*.42],[x*.8,1.58,z*.4],[x*1.08,1.82,z*.38]],.022,22);
  }

  rig.hairSpikes=[];
  rig.whiteHair.visible=false;
  rig.gear2.visible=true; rig.gear3.visible=false; rig.gear4.visible=false; rig.gear5.visible=false;
  rig.cloudRing.visible=false; rig.gear3Steam.visible=false; rig.gear4Smoke.visible=false; rig.cloudMantle.visible=false;
  rig.nikaSmile.visible=false;
  rig.hat.visible=true;
  rig.baseMeshes={};
  rig.modelQuality="grand-arena-v2";
  root.userData={rig,baseScale:1,gear:2,haki:false,modelQuality:"grand-arena-v2"};
  return root;
}
