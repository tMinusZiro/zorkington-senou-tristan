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

//Global Variables//

let prompt = ">_";

//Room Builder
class Room {
  constructor(descriptor, secretItem, items = [], props = [], toolbox = []) {
    this.descriptor = descriptor;
    this.secretItem = secretItem || "key";
    this.items = items;
    this.props = props;
    this.toolbox = toolbox;
  }

  hidden() {}

  read() {
    return this.descriptor;
  }

  sendItems() {
    let poppedItem = this.items.pop();
    player.inventory.push(poppedItem);
  }

  exit() {
    if (this.secretItem === "key") {
      console.log(`The key has been accepted and the door opened`);
    } else {
      console.log("You are still stuck in this room");
    }
  }
}

//Input Possibility Bank//
// let wordBank = {
//   movement: ["forward", "backwards", "left", "right"],
//   action: ["read", "pick up", "look around"],
// };

let actionBank = {
  examine: ["read", "look at", "examine"],
  take: ["take", "pick up", "add to", "put in inventory"],
  drop: ["drop"],
  exit: ["open door", "exit room", "leave"],
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

  displayInventory: function () {
    console.log(this.inventory);
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

  inRoom: {
    roomOne: "true",
    roomTwo: "false",
    roomThree: "false",
    roomFour: "false",
    roomFive: "false",
  },

  //need to know what room player is in

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

//Room Instances
let roomOne = new Room(
  "You are in a small room. In the corner there's a bat and a ball, and a door on the opposite side of the room.\nYou see a small cement block with something written on it\nEarly morning sunlight is streaming through the window.",
  "key",
  ["bat"],
  "cement block"
);

let streetRoomOne = new Room(
  "You exit the house. Light blinds you but they adjust. An empty street sprawls out before you. You see a notebook on the bench.",
  "",
  ["notebook"],
  ["car", "bench", "bird"]
);
let streetRoomTwo = new Room(
  "On the left you see a house that has burnt down some time ago.\nOn the right there seems to be a house in pristine condition.\nAlmost like someone lives there.\ncrashed 100 yards down. ",
  "",
  [""],
  ["rubble"]
);

let houseLeftRoom= new Room(
  "There isn't much left. The stairs have collapsed and most of the household items don't seem to be of much use. A toolbox is hidden under some debris",
  "",
  [""],
  ["rubble"],
  ["map"]
);

let houseRightRoom = new Room(
  "This house seems meticulously taken care of. Clean carpets, dishes on the table, fruit in the bowl.",
  "",
  ["knife", "fruit", "gallon jug"],
  ["carpet"],
  ""
);
let planeRoom = new Room(
  "This house seems meticulously taken care of. Clean carpets, dishes on the table, fruit in the bowl.",
  "",
  ["knife", "fruit", "gallon jug"],
  ["carpet"],
  ""
);

//Begin Game
start();

async function start() {
  console.log(`Welcome to Room One.`);
  console.log(roomOne);

  let answer = await ask(prompt);

  //Room interaction block =>
  while (answer.trim() !== true) {
    //Room descriptor
    //Is it possible to be like => if answer include wordBank.action, then actionFunction for specific room?
    if (answer.trim() === "look around") {
      console.log(roomOne.read());
    }
    //Acquire passcode
    else if (answer.trim().includes("read")) {
      console.log(`The ${roomOne.props} has a passcode on it - 1234`);
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take bat") {
      console.log(`Oh nice a bat`);
      roomOne.sendItems();
      console.log({ roomOne });
      console.log({ player });
    }
    //Exit Room
    else if (answer.trim() == "open door") {
      let unlockDoor = await ask(
        "The door has a passcode. If you know it, enter it now.\n>_"
      );

      if (unlockDoor === "1234") {
        console.log("You entered the right passcode. Onto the next room");
        roomOne.exit();
        nextStreetRoomOne();
      } else {
        console.log("Wrong passcode");
      }
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

async function nextStreetRoomOne() {
  console.log(`You're in Street Room.`);
  console.log(streetRoomOne);
  let answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(streetRoomOne.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take notebook") {
      console.log(`Hmm a note book. I wonder if the owner is still alive.`);
      streetRoomOne.sendItems();
      //Check block start//
      console.log({ streetRoomOne });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("You walk back into the room from which you woke.\n>_");
      start();
    } else if (answer.trim() == "walk down street") {
      console.log(
        "You walk further down the street and see two houses.\nThe one on the left seems to have burned down long ago.\nThe house on the right is pristine. I wonder if someone lives there.\n>_"
      );
      nextStreetRoomTwo();
    } else {
    console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

async function nextStreetRoomtwo() {
  console.log(`You're in Street Room Two.`);
  console.log(streetRoomTwo);
  let answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(streetRoomTwo.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take rubble") {
      console.log(`You can't carry rocks with you.`);
      //Check block start//
      console.log({ streetRoomTwo});
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("You walk back into the room from which you woke.\n>_");
      streetRoomOne();
    } else if (answer.trim() == "walk down street") {
      console.log(
        "You walk towards the airplane.\n>_"
      );
      nextPlaneRoom();
    } else if (answer.trim() == "house left") {
      console.log("You walk to house on th eleft.\n>_");
      nextHouseLeftRoom();
    } else if (answer.trim() == "house right") {
      console.log(
        "You walk to the house on the right.\n>_"
      );
      nextHouseRightRoom();
    } else {
    console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
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
