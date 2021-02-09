const { EAFNOSUPPORT } = require("constants");
const readline = require("readline");
const { start } = require("repl");
const { Z_BEST_COMPRESSION } = require("zlib");
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
let input; //Raw input
let inputSaniArr; //Split raw input into array of strings
let inputFirstWord; //String of first word in input

let singleItem; //String of single-word item
let doubleItem; //String of a double-word item
let singleItemRoomIndex;
let singleItemInventoryIndex;
let doubleItemRoomIndex;
let doubleItemInventoryIndex;
let currentRoomState; //String of current room
let roomState; //Object of current room
let movementPossibilityArr; //Array of possible movements

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
  ["corn", "green object", "stick"]
);
let roomTwo = new Room(
  "roomTwo is yellow",
  "You look around. Everything is yellow.",
  ["dirt", "yellow object", "yarn"]
);
let roomThree = new Room(
  "roomTwo is red",
  "You look around. Everything is red.",
  ["two books", "red object", "rake"]
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

//State change function -> This is what will allow you to move from room to room.
let currentRoom = roomOne;
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
  lookAround: ["look around", "what's here"], //Ques description of room.
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

//Action

function commandLog() {
  if (actionBank.location.includes(input)) {
    console.log(`You're in: ` + currentRoomState);
  }
}

function inventory() {
  //<--------Input sanitization------>//
  inputSaniArr = input.trim().split(" "); //splits input into array of strings

  singleItem = inputSaniArr.slice(1, 2).join(" ");
  doubleItem = inputSaniArr.slice(1, 3).join(" "); //this is to guard against items that may be two words => It will rejoin index 1-3 from input array

  //Item in Room Index//
  singleItemRoomIndex = currentRoom.items.indexOf(singleItem);
  doubleItemRoomIndex = currentRoom.items.indexOf(doubleItem);
  //Item in Inventory Index
  singleItemInventoryIndex = player.inventory.indexOf(singleItem);
  doubleItemInventoryIndex = player.inventory.indexOf(doubleItem);

  inputFirstWord = inputSaniArr.shift();

  //<-----Add items to inventory----->//
  if (
    actionBank.itemAdd.includes(inputFirstWord) &&
    currentRoom.items.includes(singleItem)
  ) {
    player.inventory.push(currentRoom.items.splice(singleItemRoomIndex, 1)); //Splices item from room and pushes into inventory
    return player.inventory;
  } else if (
    actionBank.itemAdd.includes(inputFirstWord) &&
    currentRoom.items.includes(doubleItem)
  ) {
    player.inventory.push(currentRoom.items.splice(doubleItemRoomIndex, 1));
    return player.inventory;
  } else if (
    currentRoom.items.includes(singleItem) === false ||
    currentRoom.items.includes(doubleItem) === false
  ) {
    console.log("That item does not exist in this room.");
  }

  //   //<-----Drop items from inventory----->//
}

//Input Block
begin();
async function begin() {
  while (input !== true) {
    input = await ask(prompt);

    commandLog();
    inventory();
    movement();

    //Check Block//
    console.log("\n<-----Check Block Start----->");
    console.log("Ref: you inputed: " + input);
    console.log(singleItem);
    console.log(doubleItem);
    console.log(singleItemRoomIndex);
    console.log(doubleItemRoomIndex);
    console.log(singleItemInventoryIndex);
    console.log(doubleItemInventoryIndex);


    console.log("Ref: currentRoomState: " + currentRoomState);

    console.log("\n<--Inventory Block-->\n");
    console.log("Ref: player.inventory: " + player.inventory);
    console.log("Ref: player.inventory type of: " + typeof player.inventory);
    console.log("Ref: currentRoom.items: " + currentRoom.items);

    console.log("\n<-----Check Block End----->\n");

    //Check Block End//
  }
}
