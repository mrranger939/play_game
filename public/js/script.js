const buttons = document.querySelectorAll('.btnnow');
const ribbon =  document.querySelector(".ribbon");
const playername = document.querySelector("#playername");
const winimages = document.querySelector('.winimages');
let playerOneName = "Player 1";
let playerTwoName = 'Player 2';

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
                    playername.innerHTML = `<h3>${playerTwoName}'s turn</h3>`
                } else{
                    game[buttonId] = 2;
                    console.log(game);
                    button.style.backgroundImage = 'url(images/tic.png)';
                    button.style.backgroundSize = 'cover';
                    playerTwo = false;     
                    playerOne = true;
                    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
                }
                wingame(game);
            }
        }
    });
});





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
            if(v[i[0]] === 1){
                ribbon.innerHTML = `<h1>${playerOneName} is the Winner</h1>`;
                playername.innerHTML = `<h3>${playerOneName}  is the Winner</h3>`;
            } else{
                ribbon.innerHTML = `<h1>${playerTwoName} is the Winner</h1>`;
                playername.innerHTML = `<h3>${playerTwoName}  is the Winner</h3>`;  
            }
            winimages.style.display = 'block';
            setTimeout(()=>{
                ribbon.style.display = 'none';
                ribbon.innerHTML = 'Winner';
                winimages.style.display = 'none';
            }, 3200)
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
    playername.innerHTML = `<h3>${playerOneName} turn</h3>`  
}
window.onload = function() {
    document.getElementById("btngroup").scrollIntoView({ behavior: "smooth" });
  };
  document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const playerName1 = document.getElementById('playerName1').value;
    playerOneName = playerName1;
    const playerName2 = document.getElementById('playerName2').value;
    playerTwoName = playerName2;
/*     document.getElementById('playerForm').style.display = 'none' */
    playername.innerHTML = `<h3>${playerOneName}'s turn</h3>`
  });
