const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const buildPath = path.join(__dirname, "build");

app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

io.on("connect", (socket) => {
  //console.log(`${socket.id} connected`);

  socket.on("message", (json) => {
    io.emit("message", json);
  });
});
const port = process.env.PORT || 5000;
http.listen(port, () => {
  //console.log(`Server is running on port ${port}`);
});
