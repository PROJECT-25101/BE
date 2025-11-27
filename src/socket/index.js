import { Server } from "socket.io";
import { socketConfig } from "../common/configs/socket-config.js";
import { setIO } from "./socket.instance.js";
import authSocket from "./middleware/auth.socket.js";
import seatSocket from "./modules/seat.socket.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, socketConfig);

  setIO(io);

  io.use(authSocket);

  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    seatSocket(socket, io);

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io;
};
