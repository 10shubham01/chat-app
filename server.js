const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path"); // Add the 'path' module

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

const users = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the root path to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("new user", (username) => {
    users[socket.id] = username;
    io.emit("user connected", Object.values(users));
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id];
    io.emit("user disconnected", Object.values(users));
  });

  socket.on("chat message", (message) => {
    io.emit("chat message", { user: users[socket.id], message });
  });

  socket.on("typing", () => {
    console.log("hello", users[socket.id]);
    socket.broadcast.emit("user typing", users[socket.id]);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
