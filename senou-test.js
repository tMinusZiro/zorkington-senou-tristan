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
  constructor(descriptor, secretItem, items = [], props = [], toolbox) {
    this.descriptor = descriptor;
    this.secretItem = secretItem || "key";
    this.items = items;
    this.props = props;
    this.toolbox = "closed";
  }

  revealMap() {
    if (this.toolbox === "open") {
      this.secretItem = "map";
      console.log(`Oh wow there's a map`);
    }
  }

  read() {
    return this.descriptor;
  }

  flipToolbox() {
    if (this.toolbox === "closed") {
      this.toolbox = "open";
      console.log(`You just opened the toolbox`);
    } else if (this.toolbox === "open") {
      this.toolbox = "closed";
      console.log(`You just closed the toolbox`);
    }
  }

  sendItems() {
    if (this.secretItem === "map") {
      player.inventory.push(this.secretItem);
      console.log(`You just put a map in your inventory`);
    }
    let poppedItem = this.items.pop();
    player.inventory.push(poppedItem);
    console.log(`You just added ${this.items} to your inventory`);
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
  commands: [
    "read",
    "look",
    "examine",
    "take",
    "pick",
    "add",
    "drop",
    "open door",
    "exit room",
    "leave",
  ],
  display: ["display", "show"],

  doCommand: function (answer) {
    actionBank.commands.forEach(function (command) {
      if (answer === "read" || answer === "exam") {
        Room.read();
      }
    });
  },

  displayInventory: function (answer) {
    console.log("You have these items in your inventory:");
    actionBank.display.forEach(function (item) {
      if (answer === item) {
        console.log(player.inventory);
      }
    });
  },
};

//player object
let player = {
  status: {},

  inventory: [],

  playerStatus: function () {},

  playerInventory: function () {},

  displayInventory: function () {
    console.log("You have these items in your inventory:");
    player.inventory.forEach(function (item) {
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

// state machine

// let currentRoom = roomOne;
// let roomTransitions = {
//   roomOne: streetRoomOne,
//   streetRoomOne: [streetRoomTwo, roomOne],
//   streetRoomTwo: [streetRoomOne, houseLeftRoom, houseRightRoom, planeRoom],
//   houseLeftRoom: streetRoomTwo,
//   houseRightRoom: streetRoomTwo,
//   planeRoom: [streetRoomTwo, cargoRoom, cockpitRoom],
//   cargoRoom: planeRoom,
//   cockpitRoom: [planeRoom, caveEntrance],
//   caveEntrance: [cockpitRoom, caveOne],
//   caveOne: [caveEntrance, caveTwo],
//   caveTwo: caveOne,
// };

let currentRoom = "roomOne";
let roomTransitions = {
  roomOne: ["streetRoomOne"],
  streetRoomOne: ["streetRoomTwo", "roomOne"],
  streetRoomTwo: [
    "streetRoomOne",
    "houseLeftRoom",
    "houseRightRoom",
    "planeRoom",
  ],
  houseLeftRoom: ["streetRoomTwo"],
  houseRightRoom: ["streetRoomTwo"],
  planeRoom: ["streetRoomTwo", "cargo", "cockpit"],
  cargo: ["planeRoom"],
  cockpit: ["planeRoom", "caveEntrance"],
  caveEntrance: ["cockpit", "caveRoomOne"],
  caveRoomOne: ["cave entrance", "caveRooTwo"],
  caveRoomTwo: ["caveRoomOne"],
};
function changeRoom(nextState) {
  if (roomTransitions[currentRoom].includes(nextState)) {
    currentRoom = nextState;
  } else {
    console.log(`Invalid state transition from ${currentRoom} to ${nextState}`);
  }
}

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

let houseLeftRoom = new Room(
  "There isn't much left. The stairs have collapsed and most of the household items don't seem to be of much use. A toolbox is hidden under some debris",
  "",
  [""],
  ["rubble"]
);

let houseRightRoom = new Room(
  "This house seems meticulously taken care of. Clean carpets, dishes on the table, fruit in the bowl.",
  "",
  ["knife", "fruit", "gallon jug"],
  ["carpet"],
  ""
);
let planeRoom = new Room(
  "A strange thick odor hangs in the air.\nThe inside of the plane seems deserted but there are signs something has been living in it.\nThere is a clear path towards the cockpit but a strange hole in the ground seems to lead into the bowels of the plane.",
  "",
  ["knife", "fruit", "gallon jug"],
  ["carpet"],
  ""
);

let cargoRoom = new Room(
  "Entering this dark hole seems like a terrible choice. Climbing down is difficult but you manage.\nIt is almost pitch black down here and that smell is even worse.\nIf only you had a light.",
  "",
  ["special game winner"],
  ["monster", "storage containers", "body parts"]
);

let cockpitRoom = new Room(
  "The windshields have been smashed out.\nThere seems to be a ladder attached to the nose of the plane. A crackling noise emanates from a radio on the floor.",
  "",
  [],
  ["radio", "electrical plane controls"]
);

let caveEntrance = new Room(
  "It seems like there was a huge earthquake here and the ladder led you to the entrance of some caves.\nPiles of huge rocks are tumbled all around.\nYou see a possible path up ahead to a cave.",
  "",
  [],
  ["rubble"]
);

let caveOne = new Room(
  "The cave is medium sized and you no longer have to lower your head.\nThere's a faint glow emanating from another passageway.\nBathing the pitch black space in a eerie bluish light."
);

let caveTwo = new Room(
  "Suddenly your vision comes into focus and you can't believe your eyes. Inside of a large cavern a ring of hooded figures are on there knees surrounding a glowing orb.\nIt looks like they worship it.\nYour sense of adventure compels you to go forward. But you're also really scared, maybe you should go back."
);

//Global Variables//
let prompt = ">_";
let answer;

//Begin Game
start();

async function start() {
  console.log(`Welcome to Room One.`);
  console.log(roomOne);
  actionBank.doCommand((answer = await ask(prompt)));
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
    actionBank.doCommand((answer = await ask(prompt)));
    //actionBank.displayInventory((answer = await ask(">_")));
  }
}

async function nextStreetRoomOne() {
  console.log(`You're in Street Room.`);
  console.log(streetRoomOne);
  answer = await ask(prompt);

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

async function nextStreetRoomTwo() {
  console.log(`You're in Street Room Two.`);
  console.log(streetRoomTwo);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(streetRoomTwo.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take rubble") {
      console.log(`You can't carry rocks with you.`);
      //Check block start//
      console.log({ streetRoomTwo });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("\nYou walk back towards the bench\n>_");
      nextStreetRoomOne();
    } else if (answer.trim() == "walk down street") {
      console.log("\nYou walk towards the airplane.\n>_");
      nextPlaneRoom();
    } else if (answer.trim() == "enter burned house") {
      console.log("\nYou walk over to that burned down house.\n>_");
      nextHouseLeftRoom();
    } else if (answer.trim() == "enter nice house") {
      console.log(
        "\nYou walk over to that beautiful georgian style house.\n>_"
      );
      nextHouseRightRoom();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

async function nextHouseLeftRoom() {
  console.log(`You're in House Left Room`);
  console.log(houseLeftRoom);
  console.log(`You have entered this decrepit old house.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(houseLeftRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "open toolbox") {
      houseLeftRoom.flipToolbox();
      houseLeftRoom.revealMap();

      //Check block start//
      console.log({ houseLeftRoom });
      console.log({ player });
      //Check block end//
    } else if (answer.trim() === "take map") {
      houseLeftRoom.sendItems();
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log(
        "\nYou exit the house and walk back outside to the street\n>_"
      );
      nextStreetRoomTwo();
    } else if (answer.trim() == "take rubble") {
      console.log("Why would you want to take a pile of trash.");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

async function nextHouseRightRoom() {
  console.log(`You're in the Nice House`);
  console.log(houseRightRoom);
  console.log(`You entered the nice house`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(houseRightRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (
      answer.trim() === "take knife" ||
      answer.trim() === "take gallon jug" ||
      answer.trim() === "take fruit"
    ) {
      houseRightRoom.sendItems();
      //Check block start//
      console.log({ streetRoomTwo });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("\nYou walk back out into the street.\n>_");
      nextStreetRoomTwo();
    } else if (answer.trim() == "enter kitchen") {
      console.log(
        "I want to but my sense of adventure is calling me back outside."
      );
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//Plane Room
async function nextPlaneRoom() {
  console.log(`You're in Plane Room`);
  console.log(planeRoom);
  console.log(
    `You enter the plan and immediately notice a thick odor hanging the air.\nIt looks like something or someone has been living in here.\nYou notice a dark hole in the floor that leads to the bowels of plane. A clear path leads towards the cockpit.`
  );
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(planeRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take rubble") {
      console.log(`What rubble?`);
      //Check block start//
      console.log({ planeRoom });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("You exit the plane and head back towards the street.\n>_");
      streetRoomTwo();
    } else if (answer.trim() == "go to cockpit") {
      console.log("You walk towards the cockpit\n>_");
      nextCockpitRoom();
    } else if (answer.trim() == "go to hole") {
      console.log("You nervously begin to climb down into the bowels.\n>_");
      nextCargoRoom();
    } else if (answer.trim() == "place holder for fun stuff") {
      console.log("We need to improve this game\n");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//cockpit room
async function nextCockpitRoom() {
  console.log(`You're now in the Cockpit.`);
  console.log(cockpitRoom);
  console.log(`You head down the aisle and enter the cockpit`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(cockpitRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take radio") {
      console.log(
        `It seems the radio is attached to the wall.\nMaybe if you had a screwdriver you take it off.`
      );
      //Check block start//
      console.log({ cockpitRoom });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("You leave the cockpit and head back down the aisle\n>_");
      nextPlaneRoom();
    } else if (answer.trim() == "exit window") {
      console.log(
        "Climbing out of this window is no problem.\nThat ladder leading into a giant hole in the earth is another matter entirely.\n>_"
      );
      nextCaveEntrance();
    } else if (answer.trim() == "take computer stuff") {
      console.log("You'll need to take a BCA Bootcamp in order to take that.");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//cargo room
async function nextCargoRoom() {
  console.log(`You're in the cargo hold`);
  console.log(cargoRoom);
  console.log(`Geeze it's dark down here.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(cargoRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "use flash light") {
      console.log(`You don't have one`);
      //Check block start//
      console.log({ cargoRoom });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log("Great decision. You climb out of that dank hole.\n>_");
      nextPlaneRoom();
    } else if (answer.trim() == "place holder") {
      console.log("Do Stuff.");
    } else if (answer.trim() == "plae holder") {
      console.log("Do Stuff ");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}
//Cave Entrance
async function nextCaveEntrance() {
  console.log(`You're in the Cave Entrance`);
  console.log(caveEntrance);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(caveEntrance.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take rubble") {
      console.log(`You can't carry rocks with you.`);
      //Check block start//
      console.log({ caveEntrance });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log(
        "You look up and see the sky. Heave a sigh, and begin to climb.\n>_"
      );
      nextCockpitRoom();
    } else if (answer.trim() == "walk down path") {
      console.log("You head down the path towards another possible cave.\n>_");
      nextCaveOne();
    } else if (answer.trim() == "place holder") {
      console.log("Fun Stuff");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//Cave One
async function nextCaveOne() {
  console.log(`You're in Street Room Two.`);
  console.log(caveOne);
  console.log(
    `You head down the path and have to squeeze through a tight space`
  );
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(caveOne.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take rubble") {
      console.log(
        `Why in the hell at this point in the adventure would you want a rock.`
      );
      //Check block start//
      console.log({ caveOne });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() === "go back") {
      //This will send you back to roomOne
      console.log(
        "Well I don't know if I can fit back through that space, but it's better than being in a pitch black scary cave."
      );
      nextCaveEntrance();
    } else if (answer.trim() === "enter final cave") {
      console.log("You start walking towards the light.\n>_");
      nextCaveTwo();
    } else if (answer.trim() === "placeholder") {
      console.log("Fun Stuff");
    } else if (answer.trim() == "place holder") {
      console.log("Fun Stuff");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//Cave Two and Final Room

async function nextCaveTwo() {
  console.log(`You're in cave two.`);
  console.log(caveTwo);
  console.log(`Will fill in later`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(caveTwo.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take something") {
      console.log(`You can't carry rocks with you.`);
      //Check block start//
      console.log({ streetRoomTwo });
      console.log({ player });
      //Check block end//
    }
    //Exit Room
    else if (answer.trim() == "go back") {
      //This will send you back to roomOne
      console.log(
        "After everything you've been through you're going to back out now?\nHave fun starting over."
      );
      process.exit();
    } else if (answer.trim() == "place holder ") {
      console.log("You walk towards the airplane.\n>_");
      nextPlaneRoom();
    } else if (answer.trim() == "place holder") {
      console.log("something\n");
    } else if (answer.trim() == "do something") {
      console.log("You did something.");
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}
