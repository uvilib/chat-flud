const express = require("express");
const http = require("http");
const path = require("path");
const config = require("config");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

app.use(
  express.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);
app.use(express.json({ limit: "50mb", type: "application/json" }));

const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: config.get("clientHost"),
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || config.get("PORT");
__dirname = path.resolve();

const clients = [];

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  const nickname = socket.handshake.query.nickname;
  socket.join(id);

  socket.on("connect-room", (data) => {
    clients.push(JSON.parse(data));
    io.sockets.emit("new-connect", clients);
  });

  socket.on("send-message", (data) => {
    const message = JSON.parse(data);
    message.nickname = nickname;
    message.id = id;

    if (message.image) {
      const base64str = message.image;
      const base64Image = base64str.split(";base64,").pop();
      const uuid = uuidv4();

      fs.writeFile(
        `${__dirname}/client/build/images/${uuid}.png`,
        base64Image,
        { encoding: "base64" },
        function (err) {}
      );

      message.image = `/images/${uuid}.png`;
    }

    io.sockets.emit("redux-message", message);
  });

  socket.on("disconnect", () => {
    clients.splice(clients.indexOf(nickname), 1);
    io.sockets.emit("client-disconnect", clients);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
