import express from "express";
import db from "./config/Database.js";
import dotenv from "dotenv";

// import Users from "./Models/UserModels.js";
import cookieParser from "cookie-parser";
import router from "./Routes/index.js";
import cors from "cors";

//socket io
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log(socket.id, "<<<<>>>");
});
global.io = io;
try {
  await db.authenticate();
  console.log("Database Connected ....!");

  // membuat table
  // await Users.sync();
} catch (error) {
  console.error(error);
}

httpServer.listen(5000, () => console.log("Server Berjalan Pada PORT 5000"));
