import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

/* Grand Arena Character Workshop v3
   Distinct, taller anime-game silhouettes for Gear 2/3/4/5.
   Rig contract intentionally matches public/game.js. */

export function createPirate() {
  const root = new THREE.Group();
  root.name = "GrandArena_Luffy_Character_v3";

  const mat = (color, roughness=.68, metalness=0, extra={}) =>
    new THREE.MeshStandardMaterial({color, roughness, metalness, ...extra});
  const M = {
    skin:mat(0xf1b589,.74), skinHi:mat(0xffd0a6,.74), skinShade:mat(0xc47f5e,.8),
    skinLine:mat(0xa85f4c,.82), blush:mat(0xd77f75,.82),
    hair:mat(0x17191e,.5), hairHi:mat(0x34343a,.48),
    eye:mat(0xfff5df,.26), iris:mat(0x542d1f,.24), pupil:mat(0x101216,.18),
    eyeShine:mat(0xffffff,.18), brow:mat(0x211d20,.5), mouth:mat(0x5c2730,.62),
    teeth:mat(0xfff8e8,.32), tongue:mat(0xd95866,.5),
    red:mat(0xc92d27,.72), redShade:mat(0x7b2020,.8), redHi:mat(0xe95a48,.58),
    blue:mat(0x245b99,.8), blueShade:mat(0x153d6c,.84), blueHi:mat(0x5489bb,.7),
    straw:mat(0xe5b653,.86), strawHi:mat(0xffd77b,.8), strawShade:mat(0x93652f,.86),
    band:mat(0xb6282a,.72), yellow:mat(0xf1bd47,.68), gold:mat(0xdca64b,.34,.6),
    leather:mat(0x4a3027,.85), sole:mat(0x241d1c,.9), white:mat(0xf0eee8,.86),
    whiteHi:mat(0xffffff,.54), whiteShade:mat(0xd8e0e3,.9), cloud:mat(0xf7f6f1,.88),
    cloudShade:mat(0xcbd6dc,.86), haki:mat(0x171820,.3,.18), hakiHi:mat(0x4a4354,.34,.2),
    purple:mat(0x59379b,.55,.18), purpleHi:mat(0xa078df,.42,.16),
    flame:mat(0xff542a,.32,.05,{emissive:0xa5260a,emissiveIntensity:.35}),
    flameHi:mat(0xffcf65,.35,.05,{emissive:0xa86b14,emissiveIntensity:.24}),
    lightning:mat(0xb6efff,.22,.06,{emissive:0x58b9ed,emissiveIntensity:.8}),
    seam:mat(0x6f2824,.72), stitch:mat(0xffd58b,.65)
  };

  const add=(parent,geometry,material,pos=[0,0,0],scale=[1,1,1],rot=[0,0,0])=>{
    const o=new THREE.Mesh(geometry,material);
    o.position.set(...pos); o.scale.set(...scale); o.rotation.set(...rot);
    o.castShadow=true; o.receiveShadow=true; parent.add(o); return o;
  };
  const sphere=(p,m,pos,scale,seg=28)=>add(p,new THREE.SphereGeometry(1,seg,Math.max(16,Math.floor(seg*.7))),m,pos,scale);
  const box=(p,m,pos,scale,rot=[0,0,0])=>add(p,new THREE.BoxGeometry(1,1,1),m,pos,scale,rot);
  const torus=(p,m,pos,r,t,rot=[0,0,0],seg=56)=>add(p,new THREE.TorusGeometry(r,t,12,seg),m,pos,[1,1,1],rot);
  const tube=(p,m,pts,r,seg=48,closed=false)=>{
    const curve=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)),closed,"catmullrom",.5);
    return add(p,new THREE.TubeGeometry(curve,seg,r,8,closed),m);
  };
  const capsule=(p,m,pos,r,len,rot=[0,0,0])=>add(p,new THREE.CapsuleGeometry(r,len,6,14),m,pos,[1,1,1],rot);
  const taper=(p,m,a,b,r1,r2,radial=16)=>{
    const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
    const o=add(p,new THREE.CylinderGeometry(r2,r1,d.length(),radial,2),m,A.clone().add(B).multiplyScalar(.5).toArray());
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    return o;
  };
  const spike=(p,m,a,b,r)=>{
    const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
    const o=add(p,new THREE.ConeGeometry(r,d.length(),12,2),m,A.clone().add(B).multiplyScalar(.5).toArray());
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    return o;
  };
  const lathe=(p,m,profile,scale=[1,1,1])=>{
    const points=profile.map(v=>new THREE.Vector2(v[0],v[1]));
    return add(p,new THREE.LatheGeometry(points,48),m,[0,0,0],scale);
  };

  const rig={isGLB:false,materials:{skin:M.skin,armament:M.haki},arms:[],armParts:[],fists:[],shoulders:[],legs:[],hairSpikes:[]};

  // Leg pivots are higher and legs are longer: avoid the old toy/chibi silhouette.
  rig.legs=[];
  for(const side of [-1,1]){
    const leg=new THREE.Group(); leg.position.set(side*.205,1.19,0); root.add(leg); rig.legs.push(leg);
    capsule(leg,M.skin,[0,-.25,0],.125,.30);
    sphere(leg,M.skinHi,[side*-.018,-.24,.055],[.078,.20,.09],20);
    sphere(leg,M.skinShade,[0,-.49,.005],[.12,.055,.12],18);
    capsule(leg,M.skin,[0,-.73,.005],.092,.30);
    sphere(leg,M.skinHi,[side*.015,-.7,.075],[.058,.16,.045],18);
    // Toes, individual sandal sole, leather straps and stitching.
    box(leg,M.sole,[0,-1.015,.07],[.285,.055,.43]);
    box(leg,M.leather,[0,-.977,.07],[.26,.032,.39]);
    tube(leg,M.strawShade,[[-.12,-.955,.255],[0,-.94,.13],[.12,-.955,.255]],.022,20);
    tube(leg,M.leather,[[0,-.96,.25],[0,-.945,.12],[side*.085,-.955,.02]],.018,18);
    for(let i=0;i<5;i++)sphere(leg,M.skin,[side*-.075+i*.037,-.952,.27],[.018,.018,.03],10);
    for(let i=0;i<8;i++)sphere(leg,M.gold,[side*-.11+i*.03,-1.01,.265],[.006,.006,.006],6);
    torus(leg,M.skinShade,[0,-.87,0],.09,.012,[Math.PI/2,0,0],24);
  }

  // Shorts sit at the pelvis with shaped legs and a real waistband.
  rig.shorts=new THREE.Group(); rig.shorts.position.y=1.02; root.add(rig.shorts);
  lathe(rig.shorts,M.blue,[[.22,.0],[.31,.04],[.34,.16],[.31,.31],[.29,.38],[.0,.38]],[1,1,.82]);
  for(const side of [-1,1]){
    const legShort=sphere(rig.shorts,M.blue,[side*.17,-.12,.005],[.18,.25,.255],32);
    legShort.rotation.z=side*-.035;
    box(rig.shorts,M.blueShade,[side*.17,-.305,.018],[.31,.055,.42]);
    for(let i=0;i<8;i++)sphere(rig.shorts,M.stitch,[side*.17-.12+i*.034,-.307,.235],[.008,.008,.006],7);
    tube(rig.shorts,M.blueShade,[[side*.29,.12,.17],[side*.31,-.05,.19],[side*.30,-.28,.18]],.009,22);
    box(rig.shorts,M.blueShade,[side*.29,-.08,.226],[.065,.11,.018],[0,0,side*.1]);
  }
  box(rig.shorts,M.gold,[0,.16,.28],[.14,.12,.035]);
  box(rig.shorts,M.strawShade,[0,.16,.301],[.07,.06,.012]);

  // Main torso uses a tapered lathe silhouette, not a stack of round toy parts.
  rig.torso=new THREE.Group(); rig.torso.position.y=1.92; root.add(rig.torso);
  rig.bodyShell=new THREE.Group(); rig.torso.add(rig.bodyShell);
  lathe(rig.bodyShell,M.skin,[[.20,-.57],[.29,-.48],[.33,-.25],[.37,.02],[.42,.28],[.39,.48],[.30,.62],[.17,.68],[.0,.68]],[1,1,.72]);
  sphere(rig.bodyShell,M.skinHi,[0,.36,.045],[.31,.23,.225],34);
  for(const side of [-1,1]){
    sphere(rig.bodyShell,M.skin,[side*.18,.24,.19],[.19,.16,.09],26);
    sphere(rig.bodyShell,M.skinHi,[side*.17,.36,.145],[.17,.035,.055],20);
    sphere(rig.bodyShell,M.skinShade,[side*.30,-.08,.13],[.045,.17,.055],18);
    sphere(rig.bodyShell,M.skin,[side*.13,-.04,.205],[.095,.065,.034],20);
    sphere(rig.bodyShell,M.skin,[side*.13,-.19,.19],[.09,.06,.032],20);
    tube(rig.bodyShell,M.skinShade,[[side*.02,.15,.255],[side*.02,-.02,.25],[side*.02,-.22,.22]],.007,18);
  }
  tube(rig.bodyShell,M.skinShade,[[-.27,.39,.12],[0,.46,.17],[.27,.39,.12]],.009,24);

  // Neck, collarbone and shoulder line.
  capsule(rig.torso,M.skin,[0,.69,0],.105,.13);
  for(const side of [-1,1])
    tube(rig.torso,M.skinShade,[[0,.57,.12],[side*.12,.61,.14],[side*.29,.49,.1]],.008,18);

  // Red sleeveless vest with separate flaps, rolled edges and seam work.
  rig.vest=new THREE.Group(); rig.torso.add(rig.vest);
  for(const side of [-1,1]){
    const panel=sphere(rig.vest,M.red,[side*.205,.055,.188],[.165,.405,.072],32);
    panel.rotation.z=side*.035;
    const lapel=box(rig.vest,M.redShade,[side*.115,.29,.255],[.09,.39,.025],[0,0,side*.20]);
    box(rig.vest,M.redHi,[side*.15,.27,.272],[.018,.31,.009],[0,0,side*.20]);
    tube(rig.vest,M.redShade,[[side*.30,.35,.2],[side*.34,.08,.22],[side*.28,-.25,.2]],.009,24);
    for(let i=0;i<8;i++)sphere(rig.vest,M.stitch,[side*(.30+.016*Math.sin(i*.5)),-.23+i*.075,.21],[.006,.009,.006],7);
    for(let i=0;i<4;i++)sphere(rig.vest,M.gold,[side*.075,-.16+i*.13,.267],[.014,.014,.009],10);
  }
  box(rig.vest,M.redShade,[0,-.32,.16],[.48,.045,.05]);

  // Waist sash with tied knot and two cloth tails.
  rig.sash=new THREE.Group(); rig.torso.add(rig.sash);
  torus(rig.sash,M.yellow,[0,-.49,0],.31,.055,[Math.PI/2,0,0],64);
  torus(rig.sash,M.gold,[0,-.49,0],.315,.012,[Math.PI/2,0,0],64);
  sphere(rig.sash,M.yellow,[.035,-.48,.285],[.12,.10,.06],22);
  sphere(rig.sash,M.gold,[.035,-.48,.335],[.04,.035,.015],14);
  tube(rig.sash,M.yellow,[[.09,-.49,.29],[.22,-.62,.32],[.32,-.78,.25],[.35,-.92,.19]],.04,32);
  tube(rig.sash,M.yellow,[[-.02,-.51,.29],[-.17,-.63,.31],[-.22,-.78,.25],[-.15,-.91,.18]],.034,30);
  tube(rig.sash,M.gold,[[.10,-.54,.33],[.22,-.66,.34],[.32,-.80,.27]],.008,24);

  // Anatomical shoulder, upper-arm, elbow and forearm assemblies.
  function makeHand(parent,side=1,scale=1){
    const hand=new THREE.Group(); parent.add(hand);
    sphere(hand,M.skin,[0,0,0],[.095*scale,.10*scale,.085*scale],22);
    for(let i=0;i<4;i++){
      const x=(i-1.5)*.047*scale, length=(.10+(.018-Math.abs(i-1.5)*.006))*scale;
      taper(hand,M.skin,[x,-.025*scale,.012],[x*1.06,-length,.04],.019*scale,.013*scale,10);
      sphere(hand,M.skinHi,[x*1.06,-length,.05],[.012*scale,.012*scale,.008*scale],8);
    }
    const thumb=new THREE.Group(); thumb.position.set(side*.09*scale,-.005*scale,0); hand.add(thumb);
    taper(thumb,M.skin,[0,0,0],[side*.055*scale,-.06*scale,.035*scale],.027*scale,.017*scale,10);
    return hand;
  }
  for(const side of [-1,1]){
    const arm=new THREE.Group(); arm.position.set(side*.405,.43,0); rig.torso.add(arm); rig.arms.push(arm);
    const shoulder=sphere(arm,M.skin,[0,-.045,0],[.16,.16,.15],28);
    sphere(arm,M.skinHi,[side*.025,-.09,.095],[.11,.13,.065],20);
    const bicep=capsule(arm,M.skin,[0,-.235,0],.105,.25);
    sphere(arm,M.skinHi,[side*.035,-.23,.07],[.07,.16,.05],18);
    sphere(arm,M.skinShade,[0,-.405,.005],[.095,.095,.095],18);
    const fore=capsule(arm,M.skin,[0,-.59,.015],.085,.25);
    sphere(arm,M.skinHi,[side*.015,-.57,.065],[.055,.15,.038],18);
    torus(arm,M.skinShade,[0,-.74,.015],.075,.01,[Math.PI/2,0,0],20);
    const hand=makeHand(arm,side,1); hand.position.set(0,-.79,.04);
    rig.armParts.push(bicep,fore); rig.fists.push(hand); rig.shoulders.push(shoulder);
    const nikaSleeve=new THREE.Group(); arm.add(nikaSleeve);
    capsule(nikaSleeve,M.white,[0,-.235,0],.112,.26);
    sphere(nikaSleeve,M.whiteHi,[0,-.24,.07],[.075,.15,.04],18);
    capsule(nikaSleeve,M.white,[0,-.59,.015],.094,.25);
    torus(nikaSleeve,M.whiteShade,[0,-.74,.015],.078,.012,[Math.PI/2,0,0],22);
    nikaSleeve.visible=false;
    rig.nikaSleeves=rig.nikaSleeves||[];rig.nikaSleeves.push(nikaSleeve);
    arm.userData={bicep,fore,hand,nikaSleeve};
  }

  // Head shape and face: smaller head, defined jaw, large expressive anime eyes.
  rig.head=new THREE.Group(); rig.head.position.set(0,.80,.012); rig.torso.add(rig.head);
  sphere(rig.head,M.skin,[0,0,0],[.265,.315,.238],44);
  sphere(rig.head,M.skinHi,[0,-.095,.075],[.225,.18,.19],30);
  // Jaw/chin tapers downward.
  sphere(rig.head,M.skin,[0,-.205,.055],[.16,.12,.16],26);
  for(const side of [-1,1]){
    sphere(rig.head,M.skin,[side*.245,-.02,0],[.055,.08,.07],18);
    sphere(rig.head,M.skinShade,[side*.255,-.02,.035],[.025,.045,.02],12);
    // Eye whites are slightly angled rather than circular dots.
    const white=sphere(rig.head,M.eye,[side*.102,.035,.214],[.061,.069,.024],24);
    white.rotation.z=side*-.10;
    sphere(rig.head,M.iris,[side*.102,.026,.237],[.028,.043,.014],20);
    sphere(rig.head,M.pupil,[side*.102,.023,.248],[.014,.03,.009],16);
    sphere(rig.head,M.eyeShine,[side*.113,.045,.256],[.009,.012,.006],10);
    tube(rig.head,M.brow,[[side*.17,.122,.2],[side*.105,.145,.23],[side*.04,.12,.22]],.012,18);
  }
  sphere(rig.head,M.skinShade,[0,-.045,.238],[.019,.045,.018],14);
  // Scar under the left eye and subtle cheek line.
  tube(rig.head,M.redShade,[[-.17,-.005,.218],[-.145,-.045,.239],[-.12,-.09,.226]],.007,16);
  tube(rig.head,M.skinShade,[[.12,-.115,.20],[.17,-.14,.18]],.006,12);
  tube(rig.head,M.mouth,[[-.09,-.175,.204],[-.05,-.193,.22],[0,-.20,.222],[.055,-.19,.22],[.095,-.17,.20]],.012,20);
  for(let i=0;i<4;i++)box(rig.head,M.teeth,[-.05+i*.033,-.18,.224],[.026,.016,.007]);

  // Black hair cap with shaped swept locks, not a ring of round spikes.
  rig.hair=new THREE.Group(); rig.head.add(rig.hair);
  sphere(rig.hair,M.hair,[0,.18,-.025],[.275,.17,.235],36);
  const locks=[
    [[-.22,.24,.08],[-.28,.34,.02],[-.36,.32,-.02]],
    [[-.15,.31,.10],[-.17,.43,.05],[-.25,.46,.0]],
    [[-.06,.33,.12],[-.03,.46,.08],[-.11,.52,.02]],
    [[.05,.33,.12],[.12,.45,.08],[.08,.50,.015]],
    [[.16,.29,.10],[.25,.39,.04],[.30,.36,-.02]],
    [[.23,.18,.02],[.33,.23,-.02],[.36,.17,-.08]],
    [[-.22,.14,.0],[-.33,.18,-.04],[-.35,.10,-.09]]
  ];
  for(let i=0;i<locks.length;i++){
    tube(rig.hair,i%2?M.hairHi:M.hair,locks[i],.046,18);
    spike(rig.hair,M.hair,locks[i][1],locks[i][2],.055);
  }

  // Straw hat built from a broad curved brim, crown, red band and stitched edge.
  rig.hat=new THREE.Group(); rig.head.add(rig.hat);
  add(rig.hat,new THREE.CylinderGeometry(.49,.52,.045,64,3),M.straw,[0,.33,0],[1,1,.91]);
  add(rig.hat,new THREE.CylinderGeometry(.255,.29,.22,48,3),M.strawHi,[0,.455,-.005]);
  torus(rig.hat,M.band,[0,.425,0],.27,.027,[Math.PI/2,0,0],48);
  torus(rig.hat,M.strawShade,[0,.355,0],.47,.008,[Math.PI/2,0,0],64);
  for(let i=0;i<40;i++){
    const a=i/40*Math.PI*2;
    sphere(rig.hat,M.strawShade,[Math.cos(a)*.485,.355,Math.sin(a)*.44],[.007,.006,.007],7);
  }

  // Gear 2: heat haze and narrow smoke trails are kept behind the silhouette.
  rig.gear2=new THREE.Group(); rig.gear2.position.y=.35; root.add(rig.gear2);
  for(const side of [-1,1]){
    tube(rig.gear2,M.flame,[[side*.48,.82,-.12],[side*.62,1.15,-.22],[side*.50,1.48,-.24],[side*.68,1.78,-.2]],.018,32);
    tube(rig.gear2,M.flameHi,[[side*.45,1.0,-.15],[side*.52,1.22,-.20],[side*.46,1.4,-.22]],.011,24);
  }
  torus(rig.gear2,M.flameHi,[0,.12,0],.53,.018,[Math.PI/2,0,0],56);

  // Gear 3: separate oversized right fist and forearm, with defined knuckles.
  rig.gear3=new THREE.Group(); root.add(rig.gear3);
  rig.giantArm=new THREE.Group(); rig.giantArm.position.set(.64,2.34,.08); rig.gear3.add(rig.giantArm);
  capsule(rig.giantArm,M.skin,[0,-.22,.02],.26,.35);
  sphere(rig.giantArm,M.skinHi,[.03,-.36,.10],[.24,.26,.19],28);
  capsule(rig.giantArm,M.skin,[.04,-.67,.12],.34,.32);
  sphere(rig.giantArm,M.skin,[.05,-.91,.22],[.42,.34,.34],36);
  // Four large knuckles form a clenched fist.
  for(let i=0;i<4;i++){
    const x=-.24+i*.16;
    sphere(rig.giantArm,M.skinHi,[x,-.82,.505],[.105,.12,.075],24);
    tube(rig.giantArm,M.skinShade,[[x-.035,-.88,.56],[x,-.91,.57],[x+.035,-.88,.56]],.008,12);
  }
  sphere(rig.giantArm,M.skin,[.42,-.94,.23],[.16,.18,.15],24);
  taper(rig.giantArm,M.skin,[.43,-.94,.25],[.53,-1.10,.40],.09,.065,16);
  torus(rig.giantArm,M.skinShade,[0,-.53,.04],.28,.014,[Math.PI/2,0,0],36);
  for(let i=0;i<5;i++){
    const y=-.56-i*.10;
    tube(rig.giantArm,M.skinShade,[[-.19,y,.38],[-.07,y-.018,.43],[.08,y-.012,.42],[.20,y,.36]],.008,16);
  }
  torus(rig.giantArm,M.skinHi,[0,-.64,.20],.32,.018,[Math.PI/2,0,0],44);
  rig.gear3Steam=new THREE.Group(); rig.gear3.add(rig.gear3Steam);
  for(let i=0;i<7;i++){
    const a=i/7*Math.PI*2;
    sphere(rig.gear3Steam,M.cloud,[Math.cos(a)*.62,1.72+Math.sin(a)*.18,Math.sin(a)*.28],[.12,.10,.12],20);
  }
  tube(rig.gear3Steam,M.cloud,[[-.45,1.92,-.22],[-.18,2.12,-.26],[.20,2.05,-.25],[.48,1.82,-.2]],.035,42);

  // Gear 4: Boundman. Expanded chest silhouette, Haki-coated independent arms,
  // patterned flame markings, purple sash and inflated calves.
  rig.gear4=new THREE.Group(); rig.gear4.position.y=.45; root.add(rig.gear4);
  lathe(rig.gear4,M.red,[[.25,.70],[.42,.82],[.55,1.10],[.62,1.42],[.56,1.74],[.43,2.02],[.24,2.12],[0,2.12]],[1,1,.78]);
  sphere(rig.gear4,M.redHi,[0,1.72,.20],[.43,.32,.22],36);
  for(const side of [-1,1]){
    sphere(rig.gear4,M.red,[side*.42,1.89,0],[.25,.28,.25],28);
    tube(rig.gear4,M.haki,[[side*.04,1.96,.39],[side*.17,1.79,.44],[side*.22,1.60,.43],[side*.10,1.42,.40]],.034,28);
    tube(rig.gear4,M.hakiHi,[[side*.28,1.98,.30],[side*.40,1.80,.32],[side*.34,1.64,.34]],.016,22);
    sphere(rig.gear4,M.purple,[side*.23,.95,.0],[.22,.25,.22],24);
  }
  for(const side of [-1,1]){
    tube(rig.gear4,M.haki,[[side*.47,2.07,.16],[side*.58,1.91,.20],[side*.52,1.74,.22]],.026,22);
    tube(rig.gear4,M.redShade,[[side*.39,1.98,.23],[side*.30,1.80,.30],[side*.35,1.64,.31]],.012,20);
  }
  rig.gear4Arms=[];
  for(const side of [-1,1]){
    const arm=new THREE.Group(); arm.position.set(side*.68,1.85,.03); rig.gear4.add(arm); rig.gear4Arms.push(arm);
    capsule(arm,M.haki,[0,-.20,0],.215,.28);
    sphere(arm,M.hakiHi,[side*.035,-.23,.13],[.14,.18,.08],22);
    capsule(arm,M.haki,[0,-.55,.025],.19,.34);
    torus(arm,M.purpleHi,[0,-.68,.04],.18,.027,[Math.PI/2,0,0],32);
    sphere(arm,M.haki,[0,-.84,.07],[.22,.20,.22],28);
    for(let j=0;j<4;j++)sphere(arm,M.hakiHi,[(j-1.5)*.078,-.84,.26],[.043,.06,.026],14);
  }
  // Short legs receive the dark Haki cuffs, but remain separate from normal legs.
  for(const side of [-1,1]){
    capsule(rig.gear4,M.red,[side*.22,.71,0],.20,.24);
    capsule(rig.gear4,M.haki,[side*.22,.49,.02],.15,.16);
  }
  sphere(rig.gear4,M.purple,[0,.80,.015],[.39,.20,.30],30);
  for(const side of [-1,1]){
    tube(rig.gear4,M.purpleHi,[[side*.34,.86,.20],[side*.27,.70,.235],[side*.12,.66,.24]],.014,22);
    for(let i=0;i<4;i++)sphere(rig.gear4,M.stitch,[side*(.18+i*.035),.66,.245],[.008,.008,.006],7);
  }
    torus(rig.gear4,M.purple,[0,1.03,0],.46,.065,[Math.PI/2,0,0],56);
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    sphere(rig.gear4,M.purpleHi,[Math.cos(a)*.46,1.03,Math.sin(a)*.37],[.02,.026,.02],10);
  }
  rig.gear4Smoke=new THREE.Group(); rig.gear4.add(rig.gear4Smoke);
  tube(rig.gear4Smoke,M.cloud,[[-.68,2.06,0],[-.88,2.24,-.08],[-.43,2.40,-.14],[0,2.34,-.17],[.43,2.40,-.1],[.82,2.19,0]],.043,72);
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2;
    sphere(rig.gear4Smoke,i%2?M.cloud:M.cloudShade,[Math.cos(a)*.73,1.92+Math.sin(a)*.20,Math.sin(a)*.27],[.10,.095,.10],18);
  }

  // Gear 5: Nika. White open coat, white shorts, floating spiral cloud scarf,
  // swept white hair and small lightning ribbons. No giant doughnut at the neck.
  rig.gear5=new THREE.Group(); root.add(rig.gear5);
  const nikaCoat=new THREE.Group(); nikaCoat.position.y=1.92; rig.gear5.add(nikaCoat);
  lathe(nikaCoat,M.white,[[.20,-.48],[.30,-.40],[.34,-.17],[.38,.12],[.40,.40],[.32,.63],[.18,.67],[0,.67]],[1,1,.80]);
  for(const side of [-1,1]){
    // Long open lapel panels.
    tube(nikaCoat,M.whiteHi,[[side*.12,.56,.26],[side*.23,.28,.31],[side*.20,-.06,.29],[side*.13,-.42,.23]],.045,38);
    tube(nikaCoat,M.whiteShade,[[side*.31,.48,.18],[side*.34,.12,.21],[side*.29,-.24,.18]],.012,28);
    for(let i=0;i<5;i++)sphere(nikaCoat,M.gold,[side*.04,-.20+i*.12,.28],[.012,.012,.009],8);
  }
  sphere(nikaCoat,M.white,[0,-.43,.02],[.29,.075,.23],26);
  tube(nikaCoat,M.whiteShade,[[-.28,-.40,.13],[0,-.44,.20],[.28,-.40,.13]],.012,24);
  for(const side of [-1,1]){
    tube(nikaCoat,M.whiteHi,[[side*.24,.50,.28],[side*.31,.16,.27],[side*.25,-.22,.22]],.018,28);
    sphere(nikaCoat,M.whiteHi,[side*.20,-.36,.19],[.09,.035,.025],16);
  }
  for(const side of [-1,1]){
    sphere(nikaCoat,M.white,[side*.16,-.53,.01],[.16,.19,.19],24);
  }
  // Short white cuffs and visible wrist seams.
  rig.cloudMantle=new THREE.Group(); rig.gear5.add(rig.cloudMantle);
  tube(rig.cloudMantle,M.cloud,[[.38,2.22,.02],[.57,2.38,.0],[.77,2.28,-.06],[.83,2.06,-.13],[.68,1.95,-.18],[.42,2.00,-.15]],.055,64);
  tube(rig.cloudMantle,M.cloudShade,[[-.38,2.20,.02],[-.60,2.35,-.02],[-.79,2.20,-.1],[-.75,2.00,-.16],[-.48,1.96,-.18]],.035,48);
  // Separate fluffy accents positioned asymmetrically along the cloud trail.
  for(const [x,y,z,s] of [[-.50,2.18,.03,.13],[-.70,2.28,-.04,.12],[.47,2.24,.06,.14],[.72,2.18,-.03,.11],[.57,1.99,.02,.10],[-.52,2.00,.01,.10]]){
    sphere(rig.cloudMantle,M.cloud,[x,y,z],[s*1.2,s,s],20);
  }
  // Keep a small orbit ring for the existing animation controller; it is not
  // the dominant scarf silhouette.
  rig.cloudRing=torus(rig.gear5,M.whiteHi,[0,2.14,-.04],.48,.035,[Math.PI/2,0,0],64);
  rig.whiteHair=new THREE.Group(); rig.head.add(rig.whiteHair);
  sphere(rig.whiteHair,M.white,[0,.19,-.02],[.275,.18,.24],38);
  const nikaLocks=[
    [[-.22,.22,.06],[-.30,.34,.02],[-.40,.31,-.05]],
    [[-.15,.30,.10],[-.19,.45,.05],[-.29,.51,-.02]],
    [[-.06,.32,.11],[-.04,.48,.08],[-.15,.55,.02]],
    [[.05,.32,.11],[.13,.46,.07],[.12,.54,.0]],
    [[.16,.28,.09],[.25,.40,.02],[.35,.40,-.05]],
    [[.22,.14,.02],[.33,.20,-.04],[.39,.14,-.10]],
    [[-.22,.12,0],[-.34,.17,-.05],[-.40,.08,-.10]]
  ];
  for(let i=0;i<nikaLocks.length;i++){
    tube(rig.whiteHair,i%2?M.whiteHi:M.white,nikaLocks[i],.052,22);
    spike(rig.whiteHair,M.white,nikaLocks[i][1],nikaLocks[i][2],.06);
  }
  rig.nikaLegs=new THREE.Group(); rig.gear5.add(rig.nikaLegs);
  for(const side of [-1,1]){
    const trouser=new THREE.Group(); trouser.position.set(side*.20,1.10,0); rig.nikaLegs.add(trouser);
    capsule(trouser,M.white,[0,-.13,0],.135,.21);
    sphere(trouser,M.whiteHi,[side*-.015,-.12,.07],[.08,.14,.055],18);
    torus(trouser,M.whiteShade,[0,-.28,0],.112,.014,[Math.PI/2,0,0],24);
  }
  rig.nikaSmile=new THREE.Group(); rig.head.add(rig.nikaSmile);
  // Nika's wide smile overlays the standard mouth without changing the skull size.
  tube(rig.nikaSmile,M.mouth,[[-.12,-.16,.21],[-.08,-.205,.225],[0,-.22,.228],[.08,-.205,.225],[.12,-.16,.21]],.016,24);
  box(rig.nikaSmile,M.teeth,[0,-.183,.232],[.16,.032,.012]);
  for(const side of [-1,1]){
    sphere(rig.nikaSmile,M.eye,[side*.102,.035,.221],[.062,.070,.023],22);
    sphere(rig.nikaSmile,M.iris,[side*.102,.024,.243],[.026,.042,.014],18);
    sphere(rig.nikaSmile,M.pupil,[side*.102,.022,.254],[.014,.029,.009],14);
  }
  rig.nikaLightning=new THREE.Group(); rig.gear5.add(rig.nikaLightning);
  for(let i=0;i<4;i++){
    const a=i/4*Math.PI*2,x=Math.cos(a),z=Math.sin(a);
    tube(rig.nikaLightning,M.lightning,[[x*.58,1.40,z*.32],[x*.78,1.56,z*.36],[x*.62,1.72,z*.35],[x*.88,1.86,z*.34]],.014,20);
  }

  rig.hairSpikes=[];
  rig.gear2.visible=true;
  rig.gear3.visible=false;
  rig.gear4.visible=false;
  rig.gear5.visible=false;
  rig.gear3Steam.visible=false;
  rig.gear4Smoke.visible=false;
  rig.cloudMantle.visible=false;
  rig.cloudRing.visible=false;
  rig.nikaLegs.visible=false;
  rig.whiteHair.visible=false;
  rig.nikaSmile.visible=false;
  rig.baseScale=1;
  rig.modelQuality="grand-arena-v3.3";
  rig.bodyShell.visible=true;
  root.userData={rig,baseScale:1,gear:2,haki:false,modelQuality:"grand-arena-v3"};
  return root;
}
