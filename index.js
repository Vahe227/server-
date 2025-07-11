const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer();
const dotenv = require('dotenv');

dotenv.config();

const origin = process.env.ORIGIN;
const io = new Server(httpServer, {cors: { origin: origin }});
const port = process.env.PORT;

let allCounts = {}  

io.on('connection', (socket) => {
    console.log(socket.id, "Client Connected To Server");

    socket.join('room');

    if(!allCounts[socket.id]) {
        allCounts[socket.id] = 0;
    };

    socket.emit('update-count', allCounts);

    socket.on('increase-count', () => {
        console.log(allCounts[socket.id], 'increase-count');
        allCounts(socket.id)++;

        io.to('room').emit('update-count', allCounts);
    });

    socket.on("disconnect", () => {
        delete allCounts[socket.id];
        socket.leave('room');
    });
});

httpServer.listen(port,'0.0.0.0' , () => {
    try {
        console.log(`Server Runing At http://localhost:${port}`);
    } catch (err) {
        console.error("Server Have An Error: ", err);
    };
});
