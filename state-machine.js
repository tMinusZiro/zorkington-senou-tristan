const { EAFNOSUPPORT } = require("constants");
const readline = require("readline");
const { start } = require("repl");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//Global Variables
let prompt = ">_";
let input;
let currentRoomState;
let roomState;
let movementPossibilityArr;

//Room Builder
class Room {
  constructor(intro, description, items) {
    this.intro = intro; //When entering room, queue this message
    this.description = description; //when you say look around, queue this
    this.items = items; //Array with room objects
  }
}

//Rooms
let roomOne = new Room(
  "roomOne is green",
  "You look around. Everything is green.",
  ["green object"]
);
let roomTwo = new Room(
  "roomTwo is yellow",
  "You look around. Everything is yellow.",
  ["yellow object"]
);
let roomThree = new Room(
  "roomTwo is red",
  "You look around. Everything is red.",
  ["red object"]
);

// Current room state machine//

currentRoomState = "roomOne";
roomState = {
  roomOne: ["roomTwo", "", "", "roomThree"],
  roomTwo: ["roomThree", "", "", "roomOne"],
  roomThree: ["roomOne", "", "", "roomTwo"],
};

//Lookup table => A
//Room Bank - string to object//
let roomLookUp = {
  roomOne: roomOne,
  roomTwo: roomTwo,
  roomThree: roomThree,
};

let currentRoom = roomOne;

//State change function -> This is what will allow you to move from room to room.
function changeRoom(nextState) {
  if (roomState[currentRoomState].includes(nextState)) {
    currentRoomState = nextState;
    currentRoom = roomLookUp[nextState];
    movementPossibilityArr = roomState[nextState];
  } else {
    console.log(
      `You dummy, you can't go from ${currentRoomState} to ${nextState}`
    );
  }
}

//Creates Array with the value of key of current room
//Let's say index 0 should be forward, index 3 should be backward, 1 should be left, 2 should be right
movementPossibilityArr = roomState[currentRoomState];

function movement() {
  if (
    movementBank.forward.includes(input) ||
    roomState.key === currentRoomState
  ) {
    changeRoom(movementPossibilityArr[0]);
  } else if (
    movementBank.backward.includes(input) ||
    roomState.key === currentRoomState
  ) {
    changeRoom(movementPossibilityArr[3]);
  }
}
//Player Class
let player = {
  health: 100,
  weight: 0,
  heat: 100,
  inventory: ["stock item"],
};

//Commands
let actionBank = {
  lookaround: ["look around", "what's here"],
  location: ["what room", "where"], //Tells player what room they are in currently
  itemAdd: ["take", "grab", "put away"], //Add item to player inventory
  itemDrop: ["drop"], //Drop item from player inventory to current room
};

let movementBank = {
  forward: "forward", //Index 0
  backward: "backward", //Index 3
  left: "left", //Index 1
  right: "right", //Index 2
};

//Action Command
function commandLog() {
  //<----------- This line for devs to know which room they currently are in. NO FUNCTION ------------->
  if (actionBank.location.includes(input)) {
    console.log(`You're in: ` + currentRoomState);
  }
}

if (actionBank.itemAdd.includes(input)) {
  player.inventory.push(currentRoomState.items.pop());
}

//Input Block
begin();
async function begin() {
  while (input !== true) {
    input = await ask(prompt);

    commandLog();
    movement();

    //Check Block//
    console.log("\n<-----Check Block Start----->");
    console.log("For refference, you inputed: " + input);

    console.log("\n<--Movement Block-->\n");
    console.log("Ref: currentRoomState: " + currentRoomState);
    console.log("Ref: currentRoom: " + currentRoom);
    console.log("Ref: movementPossibilityArr: " + movementPossibilityArr);

    console.log("\n<--Inventory Block-->\n");
    console.log("Ref: player.inventory: " + player.inventory);
    console.log("Ref: currentRoom.items: " + currentRoom.items);

    console.log("\n<-----Check Block End----->\n");

    //Check Block End//
  }
}

//Next up on the docket//

//Figuring out how to sanitize input -> then isolating items.
//If actionbank.yadayada.includes(saniInput) +
