import { Server } from "socket.io";
import http from "http";
import TaskModel from "../models/taskModel";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin:
      process.env.NODE_ENV === "production"
        ? true
        : "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", async(userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
        // const arr1:string[] = await TaskModel.find({assignedBy:userId},{_id:1});
        // const arr2:string[] = await TaskModel.find({assignedTo:userId},{_id:1});
        // arr1.forEach((ele)=>{
        //     socket.join(ele);
        // })
        // arr2.forEach((ele)=>{
        //     socket.join(ele);
        // })
    });
    
    
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
