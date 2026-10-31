import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { ONLINE_USERS } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { Chat } from "./models/chat.js";
import { registerChatHandlers } from "./lib/socketHandlers.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

dotenv.config({
  path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 1111;
const envMode = process.env.NODE_ENV?.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

// Using Middlewares Here
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  const userId = user._id.toString();
  const sockets = userSocketIDs.get(userId) || new Set();
  sockets.add(socket.id);
  userSocketIDs.set(userId, sockets);
  onlineUsers.add(userId);
  io.emit(ONLINE_USERS, Array.from(onlineUsers));
  registerChatHandlers({ io, socket, Chat, Message, getSockets, onlineUsers });

  socket.on("disconnect", () => {
    sockets.delete(socket.id);
    if (sockets.size === 0) {
      userSocketIDs.delete(userId);
      onlineUsers.delete(userId);
    }
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey, userSocketIDs };
