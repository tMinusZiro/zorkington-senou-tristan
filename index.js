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

//room class
class Room {
  constructor(secretItem, items = [], props = []) {
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

start();

async function start() {
  const welcomeMessage = `182 Main St.
  You are standing on Main Street between Church and South Winooski.
  There is a door here. A keypad sits on the handle.
  On the door is a handwritten sign.`;
  let answer = await ask(welcomeMessage);
  //guard clause for first prompt that will reject all output besides 'read sign'
  while (answer !== "read sign") {
    answer = await ask(">_");
    if (answer === "read sign") {
      break;
    }
    console.log(`Sorry I don't know how to ${answer}.`);
  }
  signs.read();

  process.exit();
}

//tester
//change
