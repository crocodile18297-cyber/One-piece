import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*"},pingInterval:25000,pingTimeout:20000});
app.use(express.static(path.join(__dirname,"public")));
app.get("/health",(req,res)=>res.json({ok:true,game:"One Piece Arena",players:io.engine.clientsCount}));
const players=new Map();
io.on("connection",socket=>{
  const player={id:socket.id,name:"Pirate",x:0,z:0,gear:2,hp:100,color:Math.random()*0xffffff|0};
  players.set(socket.id,player);
  socket.emit("welcome",{id:socket.id,players:[...players.values()]});
  socket.broadcast.emit("player-joined",player);
  socket.on("move",data=>{
    const p=players.get(socket.id); if(!p||!data)return;
    p.x=Math.max(-42,Math.min(42,Number(data.x)||0));
    p.z=Math.max(-42,Math.min(42,Number(data.z)||0));
    if([2,3,4,5].includes(Number(data.gear)))p.gear=Number(data.gear);
    socket.broadcast.emit("player-moved",p);
  });
  socket.on("attack",data=>{
    if(!players.has(socket.id))return;
    io.emit("player-attack",{id:socket.id,kind:String(data?.kind||"pistol").slice(0,20),x:Number(data?.x)||0,z:Number(data?.z)||0,gear:players.get(socket.id).gear});
  });
  socket.on("disconnect",()=>{players.delete(socket.id);io.emit("player-left",socket.id);});
});
const port=process.env.PORT||3000;
server.listen(port,"0.0.0.0",()=>console.log("One Piece Arena listening on "+port));
