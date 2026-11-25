import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import {GLTFLoader} from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const clips = (() => {
  const qTrack = (name, frames) => {
    const times = frames.map(f => f[0]), values = [];
    for (const frame of frames) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(frame[1][0], frame[1][1], frame[1][2], "XYZ"));
      values.push(q.x, q.y, q.z, q.w);
    }
    return new THREE.QuaternionKeyframeTrack(name + ".quaternion", times, values);
  };
  const pTrack = (name, frames) => new THREE.VectorKeyframeTrack(name + ".position", frames.map(f => f[0]), frames.flatMap(f => f[1]));
  const clip = (name, duration, tracks) => new THREE.AnimationClip(name, duration, tracks);
  return [
    clip("idle", 2, [
      qTrack("Bone_Spine", [[0,[0,0,0]],[1,[.018,0,.012]],[2,[0,0,0]]]),
      qTrack("Bone_Head", [[0,[0,-.025,0]],[1,[.015,.025,0]],[2,[0,-.025,0]]]),
      pTrack("Bone_Hips", [[0,[0,.96,0]],[1,[0,.985,0]],[2,[0,.96,0]]])
    ]),
    clip("walk", .8, [
      qTrack("Bone_Thigh_L", [[0,[.52,0,0]],[.2,[0,0,0]],[.4,[-.52,0,0]],[.6,[0,0,0]],[.8,[.52,0,0]]]),
      qTrack("Bone_Thigh_R", [[0,[-.52,0,0]],[.2,[0,0,0]],[.4,[.52,0,0]],[.6,[0,0,0]],[.8,[-.52,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,.24,0]],[.2,[0,0,0]],[.4,[0,-.24,0]],[.6,[0,0,0]],[.8,[0,.24,0]]]),
      qTrack("Bone_Arm_R", [[0,[0,-.24,0]],[.2,[0,0,0]],[.4,[0,.24,0]],[.6,[0,0,0]],[.8,[0,-.24,0]]])
    ]),
    clip("run", .56, [
      qTrack("Bone_Thigh_L", [[0,[.92,0,0]],[.14,[0,0,0]],[.28,[-.92,0,0]],[.42,[0,0,0]],[.56,[.92,0,0]]]),
      qTrack("Bone_Thigh_R", [[0,[-.92,0,0]],[.14,[0,0,0]],[.28,[.92,0,0]],[.42,[0,0,0]],[.56,[-.92,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,.55,0]],[.14,[0,0,0]],[.28,[0,-.55,0]],[.42,[0,0,0]],[.56,[0,.55,0]]]),
      qTrack("Bone_Arm_R", [[0,[0,-.55,0]],[.14,[0,0,0]],[.28,[0,.55,0]],[.42,[0,0,0]],[.56,[0,-.55,0]]])
    ]),
    clip("jump", .72, [
      qTrack("Bone_Arm_L", [[0,[0,0,0]],[.22,[0,0,.85]],[.72,[0,0,.85]]]),
      qTrack("Bone_Arm_R", [[0,[0,0,0]],[.22,[0,0,-.85]],[.72,[0,0,-.85]]]),
      qTrack("Bone_Thigh_L", [[0,[0,0,0]],[.25,[-.32,0,0]],[.72,[-.32,0,0]]]),
      qTrack("Bone_Thigh_R", [[0,[0,0,0]],[.25,[.38,0,0]],[.72,[.38,0,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.2,[-.12,0,0]],[.72,[-.12,0,0]]])
    ]),
    clip("punch", .48, [
      qTrack("Bone_Arm_R", [[0,[0,0,0]],[.14,[0,-1.12,0]],[.27,[0,-1.12,0]],[.48,[0,0,0]]]),
      qTrack("Bone_Elbow_R", [[0,[0,0,0]],[.14,[0,0,-.35]],[.27,[0,0,-.35]],[.48,[0,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,0,0]],[.14,[0,.24,0]],[.28,[0,.24,0]],[.48,[0,0,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.18,[0,-.22,0]],[.3,[0,-.22,0]],[.48,[0,0,0]]])
    ]),
    clip("heavyPunch", .64, [
      qTrack("Bone_Arm_R", [[0,[0,0,0]],[.2,[0,-1.42,0]],[.38,[0,-1.42,0]],[.64,[0,0,0]]]),
      qTrack("Bone_Elbow_R", [[0,[0,0,0]],[.2,[0,0,-.52]],[.38,[0,0,-.52]],[.64,[0,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,0,0]],[.18,[0,.36,0]],[.38,[0,.36,0]],[.64,[0,0,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.2,[0,-.34,0]],[.39,[0,-.34,0]],[.64,[0,0,0]]]),
      qTrack("Bone_Hips", [[0,[0,0,0]],[.2,[0,.14,0]],[.4,[0,.14,0]],[.64,[0,0,0]]])
    ]),
    clip("gatling", .64, [
      qTrack("Bone_Arm_R", [[0,[0,0,0]],[.1,[0,-1.1,0]],[.2,[0,0,0]],[.3,[0,-1.1,0]],[.4,[0,0,0]],[.5,[0,-1.1,0]],[.64,[0,0,0]]]),
      qTrack("Bone_Elbow_R", [[0,[0,0,0]],[.1,[0,0,-.35]],[.2,[0,0,0]],[.3,[0,0,-.35]],[.4,[0,0,0]],[.5,[0,0,-.35]],[.64,[0,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,0,0]],[.16,[0,.8,0]],[.3,[0,0,0]],[.46,[0,.8,0]],[.64,[0,0,0]]])
    ]),
    clip("kick", .62, [
      qTrack("Bone_Thigh_R", [[0,[0,0,0]],[.18,[-1.05,0,0]],[.34,[-1.05,0,0]],[.62,[0,0,0]]]),
      qTrack("Bone_Knee_R", [[0,[0,0,0]],[.18,[.58,0,0]],[.34,[.58,0,0]],[.62,[0,0,0]]]),
      qTrack("Bone_Arm_L", [[0,[0,0,0]],[.18,[0,.58,.2]],[.34,[0,.58,.2]],[.62,[0,0,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.2,[0,.2,0]],[.4,[0,.2,0]],[.62,[0,0,0]]])
    ]),
    clip("dodge", .5, [
      qTrack("Bone_Hips", [[0,[0,0,0]],[.12,[0,0,.42]],[.28,[0,0,.42]],[.5,[0,0,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.12,[0,0,-.55]],[.28,[0,0,-.55]],[.5,[0,0,0]]]),
      qTrack("Bone_Thigh_L", [[0,[0,0,0]],[.16,[-.55,0,0]],[.5,[0,0,0]]]),
      qTrack("Bone_Thigh_R", [[0,[0,0,0]],[.16,[.35,0,0]],[.5,[0,0,0]]])
    ]),
    clip("block", 1.2, [
      qTrack("Bone_Arm_L", [[0,[0,.52,0]],[.6,[0,.52,0]],[1.2,[0,.52,0]]]),
      qTrack("Bone_Arm_R", [[0,[0,-.52,0]],[.6,[0,-.52,0]],[1.2,[0,-.52,0]]]),
      qTrack("Bone_Spine", [[0,[0,0,0]],[.6,[.03,0,0]],[1.2,[0,0,0]]])
    ])
  ];
})();

export async function loadCharacterTemplate(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Character model request failed: " + response.status);
  const compressed = await response.arrayBuffer();
  if (typeof DecompressionStream === "undefined") throw new Error("This browser does not support gzip decompression.");
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
  const buffer = await new Response(stream).arrayBuffer();
  const loader = new GLTFLoader();
  return await new Promise((resolve, reject) => loader.parse(buffer, "/assets/", gltf => resolve(gltf.scene), reject));
}

export function installCharacterModel(actor, template, applyGear, applyHaki, addAura) {
  const body = template.clone(true);
  const get = name => body.getObjectByName(name);
  const rig = {
    isGLB: true,
    torso: get("Bone_Spine"), head: get("Bone_Head"),
    arms: [get("Bone_Arm_L"), get("Bone_Arm_R")],
    legs: [get("Bone_Thigh_L"), get("Bone_Thigh_R")],
    armParts: ["N_Mesh_UpperArm_L","N_Mesh_UpperArm_R","N_Mesh_Forearm_L","N_Mesh_Forearm_R"].map(get),
    fists: ["N_Mesh_Hand_L","N_Mesh_Hand_R"].map(get),
    shoulders: ["N_Mesh_Shoulder_L","N_Mesh_Shoulder_R"].map(get),
    materials: {
      skin: new THREE.MeshStandardMaterial({color:0xf2b88b,roughness:.72}),
      armament: new THREE.MeshStandardMaterial({color:0x1b1d26,roughness:.3,metalness:.28})
    },
    gear3:get("Gear3_Form"), giantArm:get("Gear3_Arm"),
    gear4:get("Gear4_Form"), gear4Arms:[get("Gear4_Arm_L"),get("Gear4_Arm_R")],
    gear5:get("Gear5_Form"), cloudRing:get("N_Gear5_CloudRing"),
    whiteHair:get("Gear5_WhiteHair"), hair:get("Hair_Base"), hairSpikes:[],
    hat:get("Straw_Hat"), vest:get("Gear2_Vest")
  };
  const mustHave = [rig.torso,rig.head,...rig.arms,...rig.legs,...rig.armParts,...rig.fists,...rig.shoulders,rig.gear3,rig.giantArm,rig.gear4,...rig.gear4Arms,rig.gear5,rig.cloudRing,rig.whiteHair,rig.hair,rig.hat,rig.vest];
  if (mustHave.some(item => !item)) throw new Error("The generated GLB is missing one or more required rig nodes.");
  actor.clear();
  body.traverse(object => { if (object.isMesh) { object.castShadow=true; object.receiveShadow=true; } });
  actor.add(body);
  actor.userData.rig = rig;
  actor.userData.modelLoaded = true;
  const mixer = new THREE.AnimationMixer(body);
  mixer.addEventListener("finished", event => { actor.userData.rigFinished = event.action.getClip().name; });
  actor.userData.mixer = mixer;
  actor.userData.rigActions = Object.fromEntries(clips.map(clip => [clip.name,mixer.clipAction(clip)]));
  actor.userData.rigActionName = null;
  applyGear(actor, actor.userData.gear || 2);
  applyHaki(actor, !!actor.userData.haki);
  addAura(actor, actor.userData.gear || 2);
  return true;
}

function play(actor, name, loop) {
  const actions = actor.userData.rigActions;
  if (!actions || !actions[name]) return;
  const previous = actor.userData.rigActionName;
  const next = actions[name];
  if (previous === name && (loop || next.isRunning() || actor.userData.rigFinished === name)) return;
  if (previous && actions[previous]) actions[previous].fadeOut(.12);
  actor.userData.rigFinished = null;
  next.reset(); next.enabled = true;
  next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
  next.clampWhenFinished = !loop;
  next.fadeIn(.12).play();
  actor.userData.rigActionName = name;
}

export function updateCharacterAnimation(actor, delta, moving, grounded, blocking=false) {
  const hit = actor.userData.attackMotion;
  const hitLive = hit && performance.now() - hit.started < hit.duration;
  let animation = "idle", loop = true;
  if (hitLive) {
    animation = hit.kind === "gatling" ? "gatling" :
      (hit.kind === "kong" || hit.kind === "redhawk") ? "heavyPunch" :
      hit.kind === "rifle" ? "kick" : "punch";
    loop = false;
  } else if (hitLive && hit.kind === "dodge") { animation = "dodge"; loop = false; }
  else if (!grounded) { animation = "jump"; loop = false; }
  else if (blocking) animation = "block";
  else if (moving) animation = actor.userData.running ? "run" : "walk";
  play(actor, animation, loop);
  actor.userData.mixer?.update(delta);
}
