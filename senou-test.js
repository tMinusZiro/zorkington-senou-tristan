const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//Room Builder
class Room {
  constructor(descriptor, secretItem, items = [], props = []) {
    this.descriptor = descriptor;
    this.secretItem = secretItem || "key";
    this.items = items;
    this.props = props;
  }

  hidden() {}

  items() {}

  exit() {
    if (this.secretItem === "key") {
      console.log(`The key has been accepted and the door opened`);
    } else {
      console.log("You are still stuck in this room");
    }
  }
}

//Input Possibility Bank//
let wordBank = {
  movement: ["forward", "backwards", "left", "right"],
  action: ["read", "pick up", "look around"],
};

let actionBank = {
    read: ["read", "look at", "examine"],
    take: ["take", "pick up", "add to", "put in inventory"],
    exit: ["open door", "exit room", "leave"]
}

//player object
let player = {
  status: {
    defaultStatus: ["awake"],
    nextStatus: ["sleep", "brave", "scared"],
  },

  inventory: [],

  playerStatus: function () {},

  playerInventory: function () {},
};

//game object
let gameObjective = {
  rooms: {
    roomOne: "locked",
    roomTwo: "locked",
    roomThree: "locked",
    roomFour: "locked",
    roomFive: "locked",
  },

  winGame: function () {
    if (
      this.roomOne === "unlocked" ||
      this.roomTwo === "unlocked" ||
      this.roomThree === "unlocked" ||
      this.roomFour === "unlocked"
    ) {
      console.log(`you won`);
      process.exit();
    }
  },
};

//Begin Game
start();

async function start() {
  console.log(`Welcome to Room One.`);
  let roomOne = new Room(
    "The room is a grey box. In the corner you there's a stick and a ball, immovable object that you can look at, and a door on the opposite side of the room",
    "key",
    ["a stick", "a ball"],
    "cement block with numbers written on it"
  );
  let answer = await ask(">_");

  //Room interaction block =>
  while (answer.trim() !== true) {
    //Room descriptor
    //Is it possible to be like => if answer include wordBank.action, then actionFunction for specific room?
    if (answer.trim() === "look around") {
      console.log(roomOne.descriptor);
    } else
    //Acquire passcode
    if(answer.trim().includes('read')) {
        console.log('The cement block has a passcode on it - 1234')
    } else
///Add specific item from specific room to player inventory
    if (answer.trim().includes('take') && answer.trim().includes(roomOne.items)){
        player.inventory.push(item)
    }else
    //Exit Room
    if (answer.trim() == "open door") {
        let unlockDoor = await ask("The door has a passcode. If you know it, enter it now.")
        if (unlockDoor === "1234") {
            console.log("You entered the right passcode. Onto the next room");
            roomOne.exit();
        } else {
            console.log("Wrong passcode")
        }

    }

    else { console.log(`Sorry I don't know how to ${answer}.`);}

    answer = await ask(">_")
  }
}



//let action = 
//If answer includes  a word from the key of any action from action bank, then que action function//
// if((actionBank.forEach(action => {answer.includes(actionBank.action)){
            //actionBank.actionfunction()
//}

//actionBank.values(actionBank)
//Should we be using double equals? [==], that way we can loosen our restrictions on casing and cut back on word banks
//Should we have an Item class and an Action class?
//if (answer.includes foreach(VERB) && answer includes foreach(ITEM IN CURRENT ROOM) { then  [VERB] [ITEM]})