const buttons = document.querySelectorAll('.btnnow');
const ribbon =  document.querySelector(".ribbon");
const playername = document.querySelector("#playername");
const winimages = document.querySelector('.winimages');
let playerOneName = "Player";
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonId = button.getAttribute('data-id');
        console.log(`Button ID: ${buttonId}`);
        if(!wingamer){
            if (!game[buttonId]){
                if(playerOne){
                    game[buttonId] = 1;
                    console.log(game);
                    button.style.backgroundImage = 'url(images/tac.png)';
                    button.style.backgroundSize = 'cover';
                    playerOne = false;
                    playerTwo = true;
                    playername.innerHTML = '<h3>AI turn</h3>'
                    wingame(game);
                    setTimeout(aiexecute, 900)

                } /* else{
                    game[buttonId] = 2;
                    console.log(game);
                    button.style.backgroundImage = 'url(images/tic.png)';
                    button.style.backgroundSize = 'cover';
                    playerTwo = false;     
                    playerOne = true;
                    playername.innerHTML = '<h3>Player 1 turn</h3>'
                } */
                
            }
        }
    });
});

function aiexecute(){
    if (!wingamer){
        let zeroIndices = [];
        for (let i = 0; i < game.length; i++) {
            if (game[i] === 0) {
                zeroIndices.push(i);
            }
        }
        if (zeroIndices.length > 0) {
            let randomIndex = zeroIndices[Math.floor(Math.random() * zeroIndices.length)];
            console.log("Random position with zero:", randomIndex);
            game[randomIndex] = 2;
            console.log(game);
            buttons[randomIndex].style.backgroundImage = 'url(./images/tic.png)';
            buttons[randomIndex].style.backgroundSize = 'cover';
            playerTwo = false;     
            playerOne = true;
            playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
            wingame(game);
        } else {
            console.log("There are no zeros in the list.");
        }
    }
}



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

function wingame(v){
    winningCombinations.forEach(i=>{
        if(v[i[0]] != 0 &&  v[i[1]] != 0 &&  v[i[2]] != 0 && v[i[0]] === v[i[1]] && v[i[1]] ===  v[i[2]]){
            wingamer = true;
            ribbon.style.display = 'block';
            
            if(v[i[0]] == 1){
                ribbon.innerHTML = `<h3>${playerOneName} is the Winner</h3>`
                winimages.style.display = 'block';
            } else{
                ribbon.innerHTML = `<h3>AI is the Winner</h3>`
            }


            setTimeout(()=>{
                ribbon.style.display = 'none';
                ribbon.innerHTML = 'Winner'
                winimages.style.display = 'none';
            }, 3000)
        } 

    })
    if(!game.includes(0) && !wingamer){
        wingamer = true;
        ribbon.style.display = 'block';
        ribbon.innerHTML =  'Tie'
        setTimeout(()=>{
            ribbon.style.display = 'none';
            ribbon.innerHTML = 'Winner'
        }, 3000)
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
    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
}
window.onload = function() {
    document.getElementById("btngroup").scrollIntoView({ behavior: "smooth" });
  };

  document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const playerName = document.getElementById('playerName').value;
    console.log(playerName); 
    playerOneName = playerName;
    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
  });