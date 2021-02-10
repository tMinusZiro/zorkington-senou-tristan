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
let singleItemRoomIndex;//Index of single-word item in currentRoom
let singleItemInventoryIndex;//Index of single-word item in inventory
let doubleItemRoomIndex;//Index of double-word item in currentRoom
let doubleItemInventoryIndex;//Index of double-word item in inventory
let currentRoomState; //String of current room
let roomState; //Object of current room
let movementPossibilityArr; //Array of possible movements

//Room Builder
class Room {
  constructor(intro, description, items, outro) {
    this.intro = intro; //When entering room, queue this message
    this.description = description; //when you say look around, queue this
    this.items = items; //Array with room objects
    this.outro = outro;
  }
}

//Rooms
let roomOne = new Room(
  "roomOne is green",
  "You look around. Everything is green.",
  ["corn", "green object", "stick"],
  "You walk away from the green room"
);
let roomTwo = new Room(
  "roomTwo is yellow",
  "You look around. Everything is yellow.",
  ["dirt", "yellow object", "yarn"],
  "you walk away from the yellow room"
);
let roomThree = new Room(
  "roomTwo is red",
  "You look around. Everything is red.",
  ["two books", "red object", "rake"],
  "you walk away from the red room"
);

// Current room state machine//

currentRoomState = "roomOne";
roomState = {
  roomOne: ["roomTwo", "", "", "roomThree"],
  roomTwo: ["roomThree", "", "", "roomOne"],
  roomThree: ["roomOne", "", "", "roomTwo"],
};

//Room Bank - string to object//
let roomLookUp = {
  roomOne: roomOne,
  roomTwo: roomTwo,
  roomThree: roomThree,
};

let itemDescription = {
  
}

//State change function -> This is what will allow you to move from room to room.
let currentRoom = roomOne;
function changeRoom(nextState) {
  if (roomState[currentRoomState].includes(nextState)) {
    console.log(currentRoom.outro)
    currentRoomState = nextState;
    currentRoom = roomLookUp[nextState];
    movementPossibilityArr = roomState[nextState];
    console.log(currentRoom.intro)
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
    console.log()
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
  displayInventory:["inventory", "show inventory"]//Show inventory
};

let movementBank = {
  forward: "forward", //Index 0
  backward: "backward", //Index 3
  left: "left", //Index 1
  right: "right", //Index 2
};

//Action


//<-----Add/Drop Items from Inventory----->
function inventory() {
  //<--------Input sanitization------>//
  inputSaniArr = input.trim().split(" "); //splits input into array of strings

  singleItem = inputSaniArr.slice(1, 2).join(" ");//Single item grab
  doubleItem = inputSaniArr.slice(1, 3).join(" "); //this is to guard against items that may be two words => It will rejoin index 1-3 from input array

  //Item in Room Index//
  singleItemRoomIndex = currentRoom.items.indexOf(singleItem);
  doubleItemRoomIndex = currentRoom.items.indexOf(doubleItem);

  singleItemInventoryIndex = player.inventory.indexOf(singleItem);
  doubleItemInventoryIndex = player.inventory.indexOf(doubleItem);


  inputFirstWord = inputSaniArr.shift();

  //<-----Add items to inventory----->//
 if (
    actionBank.itemAdd.includes(inputFirstWord) &&
    currentRoom.items.includes(singleItem)
  ) {
    player.inventory.push(currentRoom.items.splice(singleItemRoomIndex, 1)[0]); //Splices item from room and pushes into inventory


    return player.inventory;
  } else if (
    actionBank.itemAdd.includes(inputFirstWord) &&
    currentRoom.items.includes(doubleItem)
  ) {
    player.inventory.push(currentRoom.items.splice(doubleItemRoomIndex, 1)[0]);
    return player.inventory;
  } 

 //<-----Drop items from inventory----->//
  if (
    actionBank.itemDrop.includes(inputFirstWord) &&
    player.inventory.includes(singleItem)
  ) {
    currentRoom.items.push(player.inventory.splice(singleItemInventoryIndex, 1)[0])
  }
   else if (
    actionBank.itemDrop.includes(inputFirstWord) &&
    player.inventory.includes(doubleItem)
  ) {
    currentRoom.items.push(player.inventory.splice(doubleItemInventoryIndex, 1)[0])
  }
}

//<-----Queues description of currentRoom----->//
function lookAround() {
  if (actionBank.lookAround.includes(input)){
    console.log(currentRoom.description)
  }
}

//Input Block
begin();
async function begin() {
  while (input !== true) {
    input = await ask(prompt);

 
    inventory();
    lookAround();
    movement();

    //Check Block//
    console.log("\n<-----Check Block Start----->");
    console.log("Ref: you inputed: " + input);

    console.log("Ref: currentRoomState: " + currentRoomState);

    console.log("\n<--Inventory Block-->\n");
    console.log("Ref: player.inventory: " , player.inventory);
    console.log("Ref: currentRoom.items: " , currentRoom.items);
    console.log("\n<-----Check Block End----->\n");

    //Check Block End//
  }
}


//The goal here is to make a weight system//
//Each room will have a pre-determined distance to the next - 1 unit
//health continuously decreases each time you move rooms
//amount of weight acts as a mutiplier or adder to the amount of health decrease per move
//eating food, sleeping, restores set amount of health. 
