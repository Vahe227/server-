const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer();
const io = new Server(httpServer, {cors: { origin: "http://localhost:5173" }});

io.on('connection', () => {
    console.log("Client Connected To Server");
});

httpServer.listen(3000, () => {
    try {
        console.log("Server Runing At http://localhost:3000");
    } catch (err) {
        console.error("Server Have An Error: ", err);
    };
});

