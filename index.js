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
  constructor(secretItem, newInfo) {
    this.secretItem = secretItem;
    this.newInfo = newInfo;
  }

  hidden() {}

  read() {
    console.log(this.items[signs][welcome]);
  }

  items() {}

  exit() {
    if (this.secretItem === "key") {
      console.log(`The key has been accepted and the door opened`);
    } else {
      console.log("You are still stuck in this room");
    }
  }
}

//experimental nonclass object
let signs = {
  prompts: {
    signs: {
      welcome:
        "The sign says 'Welcome to Burlington Code Academy!'\nCome on up to the third floor.\nIf the door is locked, use the code 12345.",
    },
  },

  read: () => {
    return this.signs[prompts][signs][welcome];
  },
};

//player class

class Player {
  constructor(
    defaultStatus = "brave",
    nextStatus = ["brave", "tired", "excited", "scared"]
  ) {
    this.status = defaultStatus;
    this.inventory = inventory;
  }

  playerStatus() {}

  playerInventory() {}
}

//game class
class Game {
  constructor(objective) {
    this.objective = {
      roomOne: "locked",
      roomTwo: "locked",
      roomThree: "locked",
      roomFour: "locked",
      roomFive: "locked",
    };
  }

  gameStatus() {
    if (this.objective[0] === "locked") {
      console.log(`Room One has been unlocked.`);
    } //build out a loop that checks if the rooms have been unlocked and when all of them have and than game over
    //can also build out other game objectives to check for
  }
}
start();

async function start() {
  const welcomeMessage = `182 Main St.
You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.`;
  let answer = await ask(welcomeMessage);
  console.log("Now write your code to make this work!");
  process.exit();
}
