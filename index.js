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

//variables
let prompt = ">_";

//room class that will have some basic methods and a constructor
class Room {
  constructor(secretItem, items = [], props = []) {
    this.secretItem = secretItem || "key"; //default key
    this.items = items;
    this.props = props;
  }

  hidden() {}

  items() {
    //need to be able to send message to player object to push any item that the user picks up in a particular room
    //need to be able to drop items in a given room as well which would just add it to room inventory
  }
  //
  exit() {
    //if the player has the secret item in inventory then the room can be unlocked
    if (player.inventory.includes(this.secretItem)) {
      console.log(`The key has been accepted and the door opened`);
      gameObjective.rooms.roomOne = "unlocked"; //playing around with changing state by sending messages to other objects - this changes the roomOne state in gameObjective object
    } else {
      console.log("You are still stuck in this room");
    }
  }
}

let wordBank = {
  movement: ["forward", "backwards", "left", "right"],
  action: ["read", "pick up"],
};

//player object
let player = {
  status: {
    defaultStatus: ["awake"],
    nextStatus: ["sleep", "brave", "scared"],
  },

  inventory: ["key", "camera"],

  playerStatus: function () {},

  playerInventory: function () {
    this.inventory.forEach((item) => {
      console.log(item);
    });
  },
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
      this.roomFour === "unlocked" ||
      this.roomFive === "unlocked"
    ) {
      console.log(`you won`);
      process.exit();
    }
  },
};

//room instances:
let firstRoom = new Room("key", ["stick", "bat"], "chair");

async function start() {
  const welcomeMessage = `182 Main St.
  You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`;
  let answer = await ask(welcomeMessage);
  //guard clause for first prompt that will reject all output besides 'read sign'
  while (answer !== "read sign") {
    answer = await ask(prompt);
    if (answer === "read sign") {
      break;
    }
    console.log(`Sorry I don't know how to ${answer}.`);
  }

  let testMessage = await ask(
    `The sign says "Welcome to Burlington Code Academy! 
    Come on up to the third floor. 
    If the door is locked, use the code 12345."`
  );
  //just type open door for now and see what gets logged out
  answer = await ask(prompt);
  if (answer === "open door") {
    firstRoom.exit(); //opens door to next room
    console.log({ gameObjective }); // you can see the changed state in the game object
  }
  console.log({ firstRoom });
  process.exit();
}
start();

//to-do List (ideas as well)
//create intermediate variable packages for our rooms => just pass in the variable to the room instead of manually typing in items, furniture, etc...
