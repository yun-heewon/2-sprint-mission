import { Application } from "express";
import * as http from "http";
import { Server } from "socket.io";

type priceAlertMessage = {
  name: string;
  price: number;
};

export const createSocket = (app: Application) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["*"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      console.log(`${userId} joined room.`);
    });
  });

  return { server, io };
};
