//STEP1:DOM
const optionContainer = document.querySelector(".option-container");
const flipButton = document.querySelector("#flip-button");
const gamesBoardContainer = document.querySelector("#gamesboard-container");
const startButton = document.querySelector("#start-button");
const infoDisplay = document.querySelector("#info");
const turnDisplay = document.querySelector("#turn-display");

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

//step5f
let notDropped;

//STEP7:
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  //step4h: checking if the ship block have enough space to fit within the board container
  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : //if vertical
      startIndex <= width * width - width * ship.length
      ? startIndex
      : startIndex - ship.length * width + width;

  //Step4e: create an empty array. Loop over ship blocks and push it to the array
  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      //if vertical, then multiplying by widtg(10) eill give the vertical outlook
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  //step4i: checking if the block is in the same line, it cannot be separated in two different lines
  let valid;

  if (isHorizontal) {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid =
          shipBlocks[0].id % width !==
          width - (shipBlocks.length - (index + 1)))
    );
  } else {
    //vertical
    shipBlocks.every((_shipBlock, index) => {
      valid = shipBlocks[0].id < 90 + (width * index + 1);
    });
  }

  //step4j: if the space is taken or not
  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains("taken")
  );

  return { shipBlocks, valid, notTaken };
}

//Step4d: randomly add pieces to our computer board
function addShipPiece(user, ship, startId) {
  //math.random generates number between 0 and 1. If it generates less than 0.5, its true, else its false
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === "player" ? angle === 0 : randomBoolean;

  //use DOM and look for the board with ID of computer and get all of its divs
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);

  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? startId : randomStartIndex;

  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    //step4f: add classlist for each shipblocks
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    if (user === "computer") addShipPiece(user, ship, startId);

    //we didnt put the piece correctly, so we wanna put the piece back to the option container
    if (user === "player") notDropped = true;
  }
}

//step4g: add all the ships in the board
ships.forEach((ship) => addShipPiece("computer", ship));

//STEP5: Drag player ships

//step5b:
let draggedShip;

//Step5a:
const optionShips = Array.from(optionContainer.children);
optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

//Step5c use DOM and look for the board with ID of player and get all of its divs
const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener("dragover", dragOver);
  playerBlock.addEventListener("drop", dropShip);
});

//step5b:
function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

//Step5d:Dragging over
function dragOver(e) {
  e.preventDefault();
  //pass through the draggedship ID so we can get the correct ship
  const ship = ships[draggedShip.id];
  //step6d:
  highlightArea(e.target.id, ship);
}

//Step5e:Dropping Ship
function dropShip(e) {
  const startId = e.target.id;

  //get the ship that we are dragging
  const ship = ships[draggedShip.id];
  addShipPiece("player", ship, startId);

  //step5g: when we drop ship, then remove the drag ship from option container (if notdropped is false)
  if (!notDropped) {
    draggedShip.remove();
  }
}

//STEP6: Add highlight
//step6a:
function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#player div");

  //if angle is 0, we know it is horizontal
  let isHorizontal = angle === 0;

  //step6b:
  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  //step6c:
  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add("hover");
      setTimeout(() => shipBlock.classList.remove("hover", 500));
    });
  }
}

//STEP8:Game logic

//Step8a:
let gameOver = false;
let playerTurn;

//Step8b:
function startGame() {
  if (playerTurn === undefined) {
    //step8d: only want to start the game if all the pieces are in the container
    if (optionContainer.children.length !== 0) {
      infoDisplay.textContent = "Please place all your pieces first";
    } else {
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
      playerTurn = true;
      turnDisplay.textContent = "Your GO!";
      infoDisplay.textContent = "The game has started!";
    }
  }
}

//Step8c:
startButton.addEventListener("click", startGame);

//step8e:
let playerHits = [];
let computerHits = [];

//step9c:
const playerSunkShips = [];
const computerSunkShips = [];

//step8d:
function handleClick(e) {
  if (!gameOver) {
    //if we hit the ship block of the computer, add boom
    if (e.target.classList.contains("taken")) {
      e.target.classList.add("boom");
      infoDisplay.textContent = "You hit the computer's ship!";

      //we want to just take the ship name from the class to make sure ship is sunk (I checked the elements while inspecting to see what classes are their in the ship that was hit)
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className !== "block");
      classes = classes.filter((className) => className !== "boom");
      classes = classes.filter((className) => className !== "taken");
      playerHits.push(...classes);

      //step9b
      checkScore("player", playerHits, playerSunkShips);
    }

    if (!e.target.classList.contains("taken")) {
      infoDisplay.textContent = "Nothing hit this time";
      e.target.classList.add("empty");
    }
    playerTurn = false;
    const allBoardBlocks = document.querySelectorAll("#computer div");

    //remove eventlistener 1:28min
    allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 1000);
  }
}

//step8f: define computer go
function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = "Computers Go!";
    infoDisplay.textContent = "The computer is thinking...";
    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll("#player div");

      if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        computerGo();
        return;
      } else if (
        allBoardBlocks[randomGo].classList.contains("taken") &&
        allBoardBlocks[randomGo].classList.contains("boom")
      ) {
        allBoardBlocks[randomGo].classList.add("boom");
        infoDisplay.textContent = "The computer hit your ship!";

        let classes = Array.from(e.target.classList);
        classes = classes.filter((className) => className !== "block");
        classes = classes.filter((className) => className !== "boom");
        classes = classes.filter((className) => className !== "taken");
        computerHits.push(...classes);
        //step9d:
        checkScore("computer", computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = "Nothing hit this time.";
        allBoardBlocks[randomGo].classList.add("empty");
      }
    }, 1000);

    //change the turn
    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Your Go!";
      infoDisplay.textContent = "Please take your go.";

      //Add the event listener of computer back 1:34mins
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach((block) =>
        block.addEventListener("click", handleClick)
      );
    }, 2000);
  }
}

//STEP9: check how many ship we have hit
//step9a:
function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName)
        .length === shipLength
    ) {
      //step9b: we want to remove the ship from playerhit once its sunken
      if (user === "player") {
        infoDisplay.textContent = `you sunk the computer's ${shipName}`;
        playerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      if (user === "computer") {
        infoDisplay.textContent = `The computer sunk your ${shipName}`;
        computerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      userSunkShips.push(shipName);
    }
  }

  checkShip("destroyer", 2);
  checkShip("submarine", 3);
  checkShip("cruiser", 3);
  checkShip("battleship", 4);
  checkShip("carrier", 5);

  console.log("playerHits", playerHits);
  console.log("playerSunkShips", playerSunkShips);

  //step9c
  if (playerSunkShips.length === 5) {
    infoDisplay.textContent = "You sunk all the computer's ships. YOU WON!";
    gameOver = true;
  }
  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "The computer has sunk all your ships. YOU LOST!";
    gameOver = true;
  }
}
