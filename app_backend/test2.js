const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:4000");

ioClient.emit("change color", 222);
