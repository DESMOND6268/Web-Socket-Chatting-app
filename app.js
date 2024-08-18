const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("new-user", (username) => {
        console.log(`${username} joined the chat.`);
        socket.broadcast.emit("message", `${username} has joined the chat`);
    });

    socket.on("send-message", (message) => {
        console.log("Message received:", message);

        socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        socket.broadcast.emit("message", "A user has left the chat");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
