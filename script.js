//STEP1:DOM
const optionContainer = document.querySelector(".option-container");
const flipButton = document.querySelector("#flip-button");
const gamesBoardContainer = document.querySelector("#gamesboard-container");

//STEP2:Logic to flip ships
//Step2c:
let angle = 0;

//Step2a:
function flip() {
  //Array.from changes items into list of array
  const optionShips = Array.from(optionContainer.children);

  //Step2c:
  angle = angle === 0 ? 90 : 0;

  //rotates the ship
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

//Step2b:
flipButton.addEventListener("click", flip);

//STEP3:Creating Boards
//Step3a: We want our boards to be 10X10
const width = 10;

//Step3b
function createBoard(color, user) {
  //create div and inject into the gameboardContainer
  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.classList.add("game-board");
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;

  //Step3c:create square blocks inside board
  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoardContainer.append(block);
  }
  gamesBoardContainer.append(gameBoardContainer);
}

createBoard("yellow", "player");
createBoard("pink", "computer");

//STEP4 Creating Ships:
//Step4a Create Ship classes
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

//Step4b declare variable using the Ship class constructor
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

//Step4c Make array of the ships so that we can loop over them
const ships = [destroyer, submarine, cruiser, battleship, carrier];

//Step4d: randomly add pieces to our computer board
