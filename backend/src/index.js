const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/entries", entryRoutes);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendUpdate", ({ roomId, content }) => {
    socket.to(roomId).emit("receiveUpdate", content);
  });

  // ✅ New: Typing indicator
  socket.on("typing", ({ roomId, user }) => {
    socket.to(roomId).emit("showTyping", user);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}!`);
    });
  })
  .catch((error) => {
    console.log("Database not connected! " + error);
  });


console.log("MONGODB_URI:", process.env.MONGODB_URI);