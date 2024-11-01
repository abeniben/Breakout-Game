const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const startBtn = document.getElementById('start')
const restartBtn = document.getElementById('restart')

const blockWidth = 100
const blockHeight = 25
const gridWidth = 960
const ballDiameter = 35
const gridHeight = 500

let timerId
let xDirection = -2
let yDirection = 2
let score = 0 
const userStart = [360,35]
let curPosition = userStart

const ballStart = [420,60]
let curBallPosition = ballStart
//Creating blocks in diffrent positions
class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis,yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(20,470),
    new Block(130,470),
    new Block(240,470),
    new Block(350,470),
    new Block(460,470),
    new Block(570,470),
    new Block(680,470),
    new Block(790,470),
    
    new Block(20,430),
    new Block(130,430),
    new Block(240,430),
    new Block(350,430),
    new Block(460,430),
    new Block(570,430),
    new Block(680,430),
    new Block(790,430),

    new Block(20,390),
    new Block(130,390),
    new Block(240,390),
    new Block(350,390),
    new Block(460,390),
    new Block(570,390),
    new Block(680,390),
    new Block(790,390),

    new Block(20,350),
    new Block(130,350),
    new Block(240,350),
    new Block(350,350),
    new Block(460,350),
    new Block(570,350),
    new Block(680,350),
    new Block(790,350)
]



//place a block
function addBlocks(){
    
    for(let i = 0 ; i < blocks.length ; i++){
         const block = document.createElement('div')
         block.classList.add('block')
         block.style.left = blocks[i].bottomLeft[0] +'px'                  //Adding 20px to the left
         block.style.bottom = blocks[i].bottomLeft[1] + 'px'               // Adding 470px  to the bottom
         grid.appendChild(block)
    }
 
}
addBlocks()


//Add User

const user = document.createElement('div')
user.classList.add('user')
placeUser()
grid.appendChild(user)

//place User

function placeUser(){
    user.style.left = curPosition[0] + 'px'
    user.style.bottom = curPosition[1] + 'px'
}
//place ball
 
function placeBall(){
    ball.style.left = curBallPosition[0] + 'px'
    ball.style.bottom = curBallPosition[1] + 'px'
}

//Move User
function moveUser(move){
    switch(move.key){
        case 'ArrowLeft':
            if(curPosition[0] > 0){
                curPosition[0] -= 15
                placeUser()   
            }
            break;
        case 'ArrowRight':
            if(curPosition[0] < gridWidth - blockWidth){
              curPosition[0] += 20
              placeUser()
            }
              break;
}
}



//Add playing ball

const ball = document.createElement('div')
ball.classList.add('ball')
placeBall()
grid.appendChild(ball)

//Starting point
function startGame(){
    timerId = setInterval(moveBall, 20)
    document.addEventListener('keydown',moveUser)
    scoreDisplay.innerHTML = `Score: ${score}` 
    //moveBall()
}

//Start button
const manualStart = ()=>{
    startGame()
}
startBtn.addEventListener('click', manualStart)

//Restart button
restartBtn.addEventListener('click', ()=>{
    if(!curBallPosition[1] <= 0){       //If it aint game over we will not be asked to consider leaving the game
        alert('Game restarted! The game starts from scratch. ')
        window.location.reload()
    }
    window.location.reload()
})

function moveBall(){
         curBallPosition[0] += xDirection
         curBallPosition[1] += yDirection
         placeBall()
         checkForDeflection()
        
}



//Check for Collision
function checkForDeflection(){                                        // OR operator - ||
    //Check for block Deflections
    for(let i = 0 ;i < blocks.length ; i++ ){
      if(                                                            //Check if our ball is an area of a block
        (curBallPosition[0] > blocks[i].bottomLeft[0] && curBallPosition[0] < blocks[i].bottomRight[0]) && 
         curBallPosition[1] + ballDiameter > blocks[i].bottomLeft[1] && curBallPosition[1] < blocks[i].topLeft[1]
      ){
           const allBlock = Array.from(document.querySelectorAll('.block'))
           allBlock[i].classList.remove('block')
           blocks.splice(i, 1)
           changeDirection()
           score++
           scoreDisplay.textContent = `Score: ${score}` 
           //Chech for a win
           if(blocks.length === 0){
            scoreDisplay.textContent = 'Congrats, You Win!'
            scoreDisplay.style.borderBottom = '2px dotted green'
            scoreDisplay.style.fontWeight = 'bold'
            clearInterval(timerId)
            document.removeEventListener('keydown', moveUser)
            startBtn.removeEventListener('click', manualStart)   //Debug here by ctreating a function 
           }
        }
       }
        if(!curBallPosition[0] >= (gridWidth - ballDiameter) ||
        !curBallPosition[1] >= (gridHeight - ballDiameter)||
        !curBallPosition[0] <= 0){
            grid.style.borderColor = 'rgba(249, 255, 254, 0.11)'
        }
            //Check for wall deflection
        if(curBallPosition[0] >= (gridWidth - ballDiameter) ||
        curBallPosition[1] >= (gridHeight - ballDiameter)||
        curBallPosition[0] <= 0){
            changeDirection()
            grid.style.borderColor = 'darkgrey'
        }

        //Check for paddle Collision

        if(                
        curBallPosition[0] > curPosition[0] && curBallPosition[0] <= (curPosition[0] + 150) &&
        curBallPosition[1] > curPosition[1] && curBallPosition[1] <= (curPosition[1] + 25) 
        ){
            changeDirection()
        }   



        //Check for Game over
        if(curBallPosition[1] <= 0){
            clearInterval(timerId)
            scoreDisplay.innerHTML = 'Game Over!'
            scoreDisplay.style.color = 'red'
            scoreDisplay.style.fontWeight = 'bold'
            document.removeEventListener('keydown', moveUser)
            startBtn.removeEventListener('click', manualStart)

        }    
}
 


function changeDirection(){

    if(xDirection === 2 && yDirection === 2){
        yDirection = -2
        return
    }
    if(xDirection === 2 && yDirection === -2){
      xDirection = -2
      return
    }
    if(xDirection === -2 && yDirection === -2){
        yDirection = 2
        return
    } 
    if(xDirection === -2 && yDirection === 2){
        xDirection = 2
       
        return
    } 
}
 



       //  Challenges:      Start Game button at move ball function     Done
                        // Add sounds if possible   
                        // Increase the speed of the ball in the process
                        // Increase difficulty - minimizing the controller, Increasing the speed gradually 



