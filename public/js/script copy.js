const buttons = document.querySelectorAll('.btnnow');
const ribbon =  document.querySelector(".ribbon");
const playername = document.querySelector("#playername");
const winimages = document.querySelector('.winimages');
let playerOneName = "Player 1";
let playerTwoName = 'Player 2';
let urposition;
let idpos;
/* web socket connections */

console.log(roomId)
const socket = io();

socket.emit('joinroom', roomId);
/* socket.on('roomMessage', (message) => {
    console.log(message);
});
socket.on('turnMessage', (message) => {    
    console.log('Received game:', message);
    const gameArray = message.split(',').map(Number);
    game = gameArray;
    
}); */
socket.on('errorMessage', (er)=>{console.log(er)})
socket.on('playerRole', (player)=>{
    console.log(player);
    var playerNumber = player.role
    console.log(playerNumber)
    urposition = player.role
})
function disconnectSession() {
    socket.emit('disconnectSession', { roomId }); // Emit event to server
}

socket.on('sessionDisconnected', () => {
    alert('The session has been disconnected by a participant.');
    window.location.href = '/'; // Redirect to the home page
});
/* socket.on('roomFull', ({ clients }) => {
    console.log(`Clients in the room: ${clients}`);
    console.log(`type: `, typeof(clients));
    clients = clients;
}); */
/* socket.on('whoTurnMessage', (playerturn) => {
    console.log(`playerturn: ${playerturn}`);
    console.log(`type: `, typeof(playerturn));
}); */
let isPlayerTurn = false;  // Flag to check if it's the player's turn

socket.on('turn', (turn) => {
    console.log(turn, urposition);

    // Set player ID based on urposition
    if (urposition === 'Player 1') { idpos = 1; }
    if (urposition === 'Player 2') { idpos = 2; }

    if (turn === urposition) {
        console.log('Your turn:', turn);
        isPlayerTurn = true;
        playername.innerHTML = `<h3>${urposition}'s turn</h3>`;
        enableButtons();  // Enable buttons when it's the player's turn
    } else {
        console.log('Waiting for opponent:', turn);
        isPlayerTurn = false;
        playername.innerHTML = `<h3>Waiting for ${turn}</h3>`;
        disableButtons();  // Disable buttons when it's not the player's turn
    }
});

// Function to enable buttons
function enableButtons() {
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
        button.disabled = false;  // Enable button click
    });
}

// Function to disable buttons
function disableButtons() {
    buttons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);  // Remove the listener
        button.disabled = true;  // Disable button click
    });
}

function handleButtonClick(event) {
    if (!isPlayerTurn) return;  // Prevent action if it's not the player's turn

    const button = event.target;
    const buttonId = button.getAttribute('data-id');
    console.log(`Button ID: ${buttonId}`);

    if (!wingamer) {
        if (!game[buttonId]) {
            game[buttonId] = idpos;
            button.style.backgroundImage = 'url(/images/tic.png)';
            button.style.backgroundSize = 'cover';
            socket.emit('move', { roomId, turn: urposition, buttonId });
            wingame(game); // Check win condition
        }
    }
}

socket.on('move', (move)=>{
    if(urposition === 'Player 1'){idpos = 2};
    if(urposition === 'Player 2'){idpos = 1};
    const buttonId = Number(move)
    game[buttonId] = idpos;
    const button = document.querySelector(`.btnnow[data-id="${buttonId}"]`);
    button.style.backgroundImage = 'url(/images/tac.png)';
    button.style.backgroundSize = 'cover';
    
    // socket.emit('whoTurnMessage', { roomId,  turn: "playerTwo"});
    // playerOne = false;
    // playerTwo = true;
    playername.innerHTML = `<h3>${playerTwoName}'s turn</h3>`
    /* else{
    game[buttonId] = 2;
    
    button.style.backgroundImage = 'url(/images/tic.png)';
    button.style.backgroundSize = 'cover';
    socket.emit('turnMessage', { roomId,  game});
    socket.emit('whoTurnMessage', { roomId,  turn: "playerOne"});
    playerTwo = false;     
    playerOne = true;
    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
} */
console.log(game)
/* socket.emit('turnMessage', { roomId,  game}); */
wingame(game);
})

/* web socket connections */

/*     buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.getAttribute('data-id');
            console.log(`Button ID: ${buttonId}`);
            if(!wingamer){
                if (!game[buttonId]){
                    if(playerOne){
                        game[buttonId] = 1;
                        button.style.backgroundImage = 'url(/images/tac.png)';
                        button.style.backgroundSize = 'cover';
                        socket.emit('turnMessage', { roomId,  game});
                        socket.emit('whoTurnMessage', { roomId,  turn: "playerTwo"});
                        playerOne = false;
                        playerTwo = true;
                        playername.innerHTML = `<h3>${playerTwoName}'s turn</h3>`
                    } else{
                        game[buttonId] = 2;
                        
                        button.style.backgroundImage = 'url(/images/tic.png)';
                        button.style.backgroundSize = 'cover';
                        socket.emit('turnMessage', { roomId,  game});
                        socket.emit('whoTurnMessage', { roomId,  turn: "playerOne"});
                        playerTwo = false;     
                        playerOne = true;
                        playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
                    }
                    console.log(game)
                    // socket.emit('turnMessage', { roomId,  game}); 
                    wingame(game);
                }
            }
        });
    });
 */




    let winningCombinations = [
        [0, 1, 2],  
        [3, 4, 5],  
        [6, 7, 8],  
        [0, 3, 6],  
        [1, 4, 7], 
        [2, 5, 8],  
        [0, 4, 8],  
        [2, 4, 6]  
    ];
    let game = [0,0,0,0,0,0,0,0,0]

    function wingame(v) {
        winningCombinations.forEach(i => {
            if (v[i[0]] != 0 && v[i[1]] != 0 && v[i[2]] != 0 && v[i[0]] === v[i[1]] && v[i[1]] === v[i[2]]) {
                wingamer = true;
                ribbon.style.display = 'block';
    
                if (urposition === 'Player 1') {
                    if (v[i[0]] === 1) {
                        ribbon.innerHTML = `<h1>You are the Winner</h1>`;
                        playername.innerHTML = `<h3>You are the Winner</h3>`;
                        winimages.style.display = 'block'; // Show confetti for Player 1
                    } else {
                        ribbon.innerHTML = `<h1>Opponent is the Winner</h1>`;
                        playername.innerHTML = `<h3>Opponent is the Winner</h3>`;
                    }
                } else {
                    if (v[i[0]] === 2) {
                        ribbon.innerHTML = `<h1>You are the Winner</h1>`;
                        playername.innerHTML = `<h3>You are the Winner</h3>`;
                        winimages.style.display = 'block'; // Show confetti for Player 2
                    } else {
                        ribbon.innerHTML = `<h1>Opponent is the Winner</h1>`;
                        playername.innerHTML = `<h3>Opponent is the Winner</h3>`;
                    }
                }
    
                setTimeout(() => {
                    ribbon.style.display = 'none';
                    ribbon.innerHTML = 'Winner';
                    winimages.style.display = 'none'; // Hide confetti after a timeout
                    reset()
                }, 3200);
            }
        });
    
        if (!game.includes(0) && !wingamer) {
            wingamer = true;
            ribbon.style.display = 'block';
            ribbon.innerHTML = 'Tie';
            setTimeout(() => {
                ribbon.style.display = 'none';
                ribbon.innerHTML = 'Winner';
                reset()
            }, 3000);
        }
    }
    
    let playerOne = true;
    let playerTwo = false;
    let wingamer = false;
    function reset(){
        wingamer = false;
        playerOne = true;
        playerTwo = false;
        game = [0,0,0,0,0,0,0,0,0]
        buttons.forEach(button => {button.style.backgroundImage = 'none';})
        //playername.innerHTML = `<h3>${turn} turn</h3>`  
    }


window.onload = function() {
    document.getElementById("btngroup").scrollIntoView({ behavior: "smooth" });
  };
/*   document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const playerName1 = document.getElementById('playerName1').value;
    playerOneName = playerName1;
    const playerName2 = document.getElementById('playerName2').value;
    playerTwoName = playerName2;
//     document.getElementById('playerForm').style.display = 'none' 
    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
  }); */
