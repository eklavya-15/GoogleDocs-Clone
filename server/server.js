require('dotenv').config();
const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST","PATCH"]
    }
});


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

const defaultValue = "";

io.on("connection", (socket) => {
    socket.on("get-document", async (documentId) => {
        const document = await findByIdOrCreate(documentId);
        socket.join(documentId);

        // Use socket.emit to send a message to the connecting client
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data) => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
});

const findByIdOrCreate = async (id) => {
    if (id == null) return;
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
