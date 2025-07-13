// Importing Package's

const http = require('http');
const { Server } = require('socket.io');

// Createing Server

const httpServer = http.createServer();

// Dotenv import for .env files

const dotenv = require('dotenv');

dotenv.config();

// We design the brain of the server.

const origin = process.env.ORIGIN;
const io = new Server(httpServer, {cors: { origin: origin },  pingInterval: 5000,pingTimeout: 10000});
const port = process.env.PORT || 3000;

// Creating a variable allCounts for the number of customers

let allCounts = {}  

// An IO connection is created which will perform some action once the client connects.

io.on('connection', (socket) => {
    try {
        console.log(socket.id, "Client Connected To Server");

        // A room is created, named room, and it is created to store clients in that room.

        socket.join('room');

        //  an if statement is created that checks if the client does not have a count then its count is equal to 0

        if(!allCounts[socket.id]) {
            allCounts[socket.id] = 0;
        };

        // An event named update-count is created, which sends allCounts to the React.js code.

        socket.emit('update-count', allCounts);

        // we respond to an event named increase-count which prints the client count to the console

        socket.on('increase-count', () => {
            console.log(allCounts[socket.id], 'increase-count');
            allCounts[socket.id]++;

            io.to('room').emit('update-count', allCounts);
        });

    // This route is created when a user leaves the server and web application, we need to delete their id from allCounts and remove them from the room named "room".

    socket.on('disconnect', () => {
        delete allCounts[socket.id];
        socket.leave('room');
    });
    } catch (err) {
        console.error('IO connect have an error: ', err);
    };
});

// There we tell the server to listen on the port variable that comes from the .env file.

httpServer.listen(port,'0.0.0.0' , () => {
    try {
        console.log(`Server Runing At http://localhost:${port}`);
    } catch (err) {
        console.error("Server Have An Error: ", err);
    };
});