const express = require("express");
const winston = require("winston");
require("winston-socket.io");
const encrypt = require("socket.io-encrypt");
const app = express();
const port = 3000;

var timestamp = new Date();

var encrypted_transport = new winston.transports.SocketIO({
    host: "localhost",
    port: 8080,
    secure: true,
    reconnect: true,
    namespace: "log",
    log_topic: "log"
});
//encrypt("secret")(encrypted_transport);

let logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console(),
        encrypted_transport,
        new winston.transports.File({
            filename: "info.log",
            level: "info"
        })
    ]
});

app.get("/", (req, res) => {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7);
    }
    var date =
        timestamp.getFullYear() +
        "-" +
        (timestamp.getMonth() + 1) +
        "-" +
        timestamp.getDate();
    var time =
        timestamp.getHours() +
        ":" +
        timestamp.getMinutes() +
        ":" +
        timestamp.getSeconds();
    var offset = -timestamp.getTimezoneOffset();
    console.log(
        (offset >= 0 ? "+" : "-") + parseInt(offset / 60) + ":" + (offset % 60)
    );
    var datetime = date + " " + time;
    logger.log(
        "info",
        "I'm logging this as a stack trace for a hello-World Response sent at " +
        timestamp.toLocaleString() +
        " incoming from IP: " +
        ip
    );
    res.send(
        "Hello World! at " +
        timestamp.toLocaleString() +
        " from IP: " +
        req.connection.remoteAddress
    );
});

app.listen(port, "0.0.0.0", () =>
    console.log(`Example app listening on port ${port}!!`)
);