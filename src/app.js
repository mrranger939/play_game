const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const publicStaticPath = path.join(__dirname, "../public");
const temp_path = path.join(__dirname, "../views");
const app = express();
const { v4: uuidv4 } = require('uuid');
app.set("view engine", "ejs");
app.set("views", temp_path);
app.use(express.static(publicStaticPath));
app.use(bodyparser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors({ origin:  process.env.FRONTEND_URL||'http://localhost:8000', credentials: true })); 

const {Server} = require("socket.io");
const { Socket } = require("socket.io-client");
const server = app.listen(process.env.PORT || 8000,'0.0.0.0', () => {
    console.log(`server started on ${process.env.PORT || 8000} may be on http://localhost:${process.env.PORT || 8000}/`)
    
});

/* socket handling */
const rooms = {}
const io = require('socket.io')(server, {
    cors: {
      origin: process.env.FRONTEND_URL||'http://localhost:8000', 
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  
// Join random room or create one if none available
app.get('/joinrandom', (req, res) => {
    let availableRoom = Object.keys(rooms).find(
        roomId => rooms[roomId].clients.length < 2
    );

    if (!availableRoom) {
        availableRoom = uuidv4(); 
        rooms[availableRoom] = { clients: [] };
    }

    res.json({ roomId: availableRoom });
});


// Create a room for friends
app.get('/createroom', (req, res) => {
    const roomId = uuidv4(); 
    rooms[roomId] = { clients: [] };
    res.json({ roomId });
});
let waitingPlayers = [];
io.on('connection', (socket)=>{
    /* console.log(`User connected: ${socket.id}`); */
/*     socket.on('joinroom', (roomId)=>{
        if(!rooms[roomId]){
            socket.emit('errorMessage', 'error Message no room found');
            return;
        }
        if(rooms[roomId].clients.length>= 2){
            socket.emit('errorMessage', "Room is full");
            return;
        }
        socket.join(roomId);
        rooms[roomId].clients.push(socket.id);
        console.log(`Client ${socket.id} joined the room ${roomId}`);
        console.log("rooms",rooms)
        // socket.to(roomId).emit('roomMessage', `${socket.id} joined the room.`); 
        if (rooms[roomId].clients.length === 1) {
            // Notify the first player to wait
            socket.emit('waitingMessage', 'Waiting for another player to join...');
        }
        if (rooms[roomId].clients.length == 2) {
            const [player1, player2] = rooms[roomId].clients;

            io.to(player1).emit('startGame', { roomId });
            io.to(player2).emit('startGame', { roomId });
            console.log(`Room ${roomId} is ready with 2 players.`);
            setTimeout(()=>{
                io.to(player1).emit('playerRole', { role: 'Player 1', opponent: player2 });
                io.to(player2).emit('playerRole', { role: 'Player 2', opponent: player1 });
                console.log(`Assigned roles in room ${roomId}: Player 1 - ${player1}, Player 2 - ${player2}`);
                io.to(player1).emit('turn', 'Player 1');
            }, 2000)
            return;
        }
    }); */

/* new chnages code here */
// For 2p: making room message
socket.on('joinroom', (roomId) => {
    if (!rooms[roomId]) {
        socket.emit('errorMessage', 'error Message no room found');
        return;
    }
    if (rooms[roomId].clients.length >= 2) {
        socket.emit('errorMessage', "Room is full");
        return;
    }
    socket.join(roomId);
    rooms[roomId].clients.push(socket.id);
/*     console.log(`Client ${socket.id} joined the room ${roomId}`);
    console.log("rooms", rooms); */


    if (rooms[roomId].clients.length === 2) {
        const [player1, player2] = rooms[roomId].clients;
        io.to(player1).emit('playerRole', { role: 'Player 1', opponent: player2 });
        io.to(player2).emit('playerRole', { role: 'Player 2', opponent: player1 });
       /*  console.log(`Assigned roles in room ${roomId}: Player 1 - ${player1}, Player 2 - ${player2}`); */
        io.to(player1).emit('turn', 'Player 1');
        return;
    }
});

// For 2pr/:id: making room message for 2pr/:id


socket.on('joinroom2p', () => {
    
    if (waitingPlayers.length < 2) {
        waitingPlayers.push(socket.id);
       /*  console.log(`Player ${socket.id} added to waiting queue`);
        console.log('Waiting players:', waitingPlayers);  */

   
        if (waitingPlayers.length === 1) {
            socket.emit('waitingMessage', 'Waiting for another player to join...');
        }

       
        if (waitingPlayers.length === 2) {
          
            const roomId = uuidv4();
            /* console.log(`Room created: ${roomId}`); */


            io.to(waitingPlayers[0]).emit('roomId', { roomId });
            io.to(waitingPlayers[1]).emit('roomId', { roomId });

            io.to(waitingPlayers[0]).emit('startGame', { roomId });
            io.to(waitingPlayers[1]).emit('startGame', { roomId });
/* 
            console.log(`Room ${roomId} is ready with 2 players: ${waitingPlayers[0]}, ${waitingPlayers[1]}`); */

            
            waitingPlayers = [];
        }
    } else {
        
        socket.emit('errorMessage', "Room is full");
    }
});




/* new chnages code here */

    socket.on('move', (details)=>{
        /* console.log(details) */
        const [player1, player2] = rooms[details.roomId].clients;
        if (details.turn === 'Player 1'){
            io.to(player2).emit('move', details.buttonId);
            io.to(details.roomId).emit('turn', 'Player 2');
        }
        if (details.turn === 'Player 2'){
            io.to(player1).emit('move', details.buttonId);
            io.to(details.roomId).emit('turn', 'Player 1');
        }
    })
    socket.on('disconnectSession', ({ roomId }) => {
        if (!rooms[roomId]) return;

     
        io.to(roomId).emit('sessionDisconnected');
        
      
        rooms[roomId].clients.forEach(clientId => {
            io.sockets.sockets.get(clientId)?.leave(roomId);
        });

        
        delete rooms[roomId];
        //console.log(`Session disconnected for room ${roomId}`);
    });

    
    socket.on('disconnect', () => {
        //console.log(`User disconnected: ${socket.id}`);
    
        // Remove the disconnected user from the waiting queue
        const indexInQueue = waitingPlayers.indexOf(socket.id);
        if (indexInQueue !== -1) {
            //console.log(`Removing ${socket.id} from waiting queue`);
            waitingPlayers.splice(indexInQueue, 1);
            //console.log('Updated waiting players:', waitingPlayers);
        }
    
        // Check if the user was part of any room and handle cleanup
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const index = room.clients.indexOf(socket.id);
    
            if (index !== -1) {
                //console.log(`Removing ${socket.id} from room ${roomId}`);
                room.clients.splice(index, 1);
    
                if (room.clients.length === 0) {
                    delete rooms[roomId];
                    //console.log(`Deleted room ${roomId}`);
                }
                break;
            }
        }
    });
    
    
    
/*     socket.on('roomMessage', ({ roomId, message }) => {
        io.to(roomId).emit('roomMessage', `${socket.id}: ${message}`);
    });
    socket.on('turnMessage', ({ roomId, game }) => {
        io.to(roomId).emit('turnMessage', `${game}`);
    });
    socket.on('whoTurnMessage', ({ roomId, turn }) => {
        io.to(roomId).emit('whoTurnMessage', `${turn}`);
    }); */

})
/* socket handling */
/* handling the get requests */
app.get("/", (req, res)=>{
    res.render("home")
})
app.get('/sp', (req, res)=>{
    res.render("sp")
})
app.get('/ai', (req, res)=>{
    res.render("ai")
})
app.get('/2p', (req, res)=>{
    res.render('2p')
})
app.get('/2pr/:id', (req, res) => {
    const roomId = req.params.id;
    //console.log(`Received request for room: ${roomId}`);
    if (!rooms[roomId]){
        rooms[roomId] = {clients:[]};
        //console.log(`Room ${roomId} created `);
    }
    res.render('2pr', { id: roomId }); 

});

/* handling the get requests */