"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        socket.on("join", async (userId) => {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
