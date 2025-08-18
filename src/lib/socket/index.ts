import { Application } from "express";
import * as http from "http";
import { Server } from "socket.io";

export const createSocket = (app: Application) => {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["*"],
        }
    });
    io.on("connection", (socket) => {
        socket.on('message', (msg) => {
            io.emit('message', msg);
        });
        console.log("user connected");

    })
    
    return { server, io };
}    

