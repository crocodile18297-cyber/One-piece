import express from "express";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import {fileURLToPath} from "url";
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(),server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*"},pingInterval:25000,pingTimeout:20000});
app.use(express.static(path.join(__dirname,"public")));
const players=new Map(),cooldowns=new Map();
app.get("/health",(req,res)=>res.json({ok:true,game:"One Piece Grand Arena",players:players.size}));
io.on("connection",socket=>{
 const p={id:socket.id,name:"Pirate",x:0,z:0,gear:2,hp:100,maxHp:100,stamina:100,level:1};
 players.set(socket.id,p);socket.emit("welcome",{id:socket.id,players:[...players.values()]});socket.broadcast.emit("player-joined",p);
 socket.on("move",d=>{const q=players.get(socket.id);if(!q||!d)return;q.x=Math.max(-43,Math.min(43,Number(d.x)||0));q.z=Math.max(-43,Math.min(43,Number(d.z)||0));if([2,3,4,5].includes(+d.gear))q.gear=+d.gear;socket.broadcast.emit("player-moved",q)});
 socket.on("attack",d=>{
  const a=players.get(socket.id);if(!a)return;
  const kind=["pistol","gatling","kong","redhawk","rifle"].includes(d?.kind)?d.kind:"pistol";
  const now=Date.now(),key=socket.id+":"+kind,cd={pistol:360,gatling:125,kong:1300,redhawk:850,rifle:700}[kind];
  if(now-(cooldowns.get(key)||0)<cd)return;cooldowns.set(key,now);
  const range={pistol:5.5,gatling:4.4,kong:8,redhawk:6,rifle:10}[kind],damage={pistol:9,gatling:4,kong:27,redhawk:19,rifle:16}[kind]*(a.gear===4?1.2:a.gear===5?1.35:1);
  const victims=[];
  for(const target of players.values()){if(target.id===socket.id||target.hp<=0)continue;const dist=Math.hypot(target.x-a.x,target.z-a.z);if(dist<=range) {target.hp=Math.max(0,target.hp-damage);victims.push({id:target.id,hp:target.hp,damage});io.to(target.id).emit("got-hit",{hp:target.hp,damage,from:socket.id});}}
  io.emit("player-attack",{id:socket.id,kind,x:a.x,z:a.z,gear:a.gear,victims});
 });
 socket.on("respawn",()=>{const q=players.get(socket.id);if(q){q.hp=q.maxHp;q.x=0;q.z=0;socket.emit("stats",q);io.emit("player-respawned",q)}});
 socket.on("disconnect",()=>{players.delete(socket.id);for(const k of cooldowns.keys())if(k.startsWith(socket.id+":"))cooldowns.delete(k);io.emit("player-left",socket.id)});
});
server.listen(process.env.PORT||3000,"0.0.0.0",()=>console.log("Grand Arena online"));
