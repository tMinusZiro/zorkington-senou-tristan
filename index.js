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
  constructor(descriptor, secretItem, items, props, toolbox) {
    this.descriptor = descriptor;
    this.secretItem = secretItem || "key";
    this.items = items;
    this.props = props;
    this.toolbox = "closed";
  }


  read() {
    return this.descriptor;
  }
//"Hidden Item - a map is found within a toolbox. Once opened, stays open"
  openToolbox() {
    if (this.toolbox === "closed") {
      this.toolbox = "open";
      console.log(`You just opened the toolbox`);
    } else if (this.toolbox === "open") {
      console.log(`This tool box has already been open`);
    }
  }
  
  revealMap() {
    if (this.toolbox === "open") {
      this.secretItem = "map";
      console.log(`Oh wow there's a map`);
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
      console.log(`The passcode has been accepted and the door opened`);
      gameObjective.rooms.roomOne = "unlocked";
    } else {
      console.log("You are still stuck in this room");
    }
  }
}

let actionBank = {
  examine: ["read", "look", "examine"],
  take: ["take", "pick", "add"],
  drop: ["drop"],
  exit: ["open door", "exit room", "leave"],
  display: ["display", "show"],

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
  status: {
    defaultStatus: ["awake"],
    nextStatus: ["sleep", "brave", "scared"],
  },

  inventory: [],

  displayInventory: function () {
    console.log("You have these items in your inventory:");
    player.inventory.forEach(function (item) {
      console.log(item);
    });
  },
};

//game object//
let gameObjective = {
  rooms: {
    roomOne: "locked",
    roomTwo: "locked",
    roomThree: "locked",
    roomFour: "locked",
    roomFive: "locked",
  },
};

//Room Instances
let roomOne = new Room(
  "You are in a small room. In the corner there's a bat, and a door on the opposite side of the room.\nYou see a small cement block with something written on it\nEarly morning sunlight is streaming through the window.",
  "key",
  ["bat"],
  "cement block"
);

let streetRoomOne = new Room(
  "Light blinds you but your eyes adjust.\nAn empty street sprawls out before you.\mYou see a notebook on the bench.",
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
  "There isn't much left.\nThe stairs have collapsed and most of the household items don't seem to be of much use.\nA toolbox is hidden under some debris",
  "",
  [""],
  ["rubble"]
);

let houseRightRoom = new Room(
  "This house seems meticulously taken care of.\nClean carpets, dishes on the table, fruit in the bowl.\nPerhaps someone is living here but no one seems to be home.",
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
  "Entering this dark hole seems like a terrible choice.\nClimbing down is difficult but you manage.\nIt is almost pitch black down here and that smell is even worse.\nIf only you had a light.",
  "",
  ["special game winner"],
  ["monster", "storage containers", "body parts"]
);

let cockpitRoom = new Room(
  "The windshields have been smashed out.\nThere seems to be a ladder attached to the nose of the plane.\nA crackling noise emanates from a radio on the floor.",
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

//Each async function will have identical commands +/- depending on instances of items or variances in next-room availability//
async function start() {
  console.log(
    `Welcome:\nCommands: open door | read | look around | take | display inventory`
  );
  answer = await ask(prompt);
  //Room interaction block =>
  while (answer.trim() !== true) {
    //Room descriptor
    if (answer.trim() === "look around") {
      console.log(roomOne.read());
    }
    //Acquire passcode
    else if (answer.trim().includes("read")) {
      console.log(`The ${roomOne.props} has a passcode on it - 1234`);
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(`Oh nice a bat`);
      roomOne.sendItems();
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    }
    //Exit Room
    else if (answer.trim() == "open door") {
      if (gameObjective.rooms.roomOne === "unlocked") {
        console.log(`This door has already been unlocked, proceed`);
        nextStreetRoomOne();
      }
    //Must enter password correctly to exit room//Once exited, room stays open. 
      let unlockDoor = await ask(
        "The door has a passcode. If you know it, enter it now.\n>_"
      );

      if (unlockDoor === "1234") {
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
  console.log(
    `\nCommands: read | look around | take | forward | backward | display inventory`
  );

  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(streetRoomOne.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer.trim() === "take") {
      console.log(`Hmm a note book. I wonder if the owner is still alive.`);
      streetRoomOne.sendItems();
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    }
    //Exit Room
    else if (answer.trim() == "backward") {
      //This will send you back to roomOne
      console.log("You walk back into the room from which you woke.\n>_");
      start();
    } else if (answer.trim() == "forward") {
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
  console.log(
    `\nCommands:\nread | look around | take | forward | backward | display inventory\ngo left | go right`
  );
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(streetRoomTwo.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(`There nothing to take.`);
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() == "backward") {
      //This will send you back to roomOne
      console.log("\nYou walk back towards the bench\n>_");
      nextStreetRoomOne();
    } else if (answer.trim() == "forward") {
      console.log("\nYou walk towards the airplane.\n>_");
      nextPlaneRoom();
    } else if (answer.trim() == "go left") {
      console.log("\nYou walk over to that burned down house.\n>_");
      nextHouseLeftRoom();
    } else if (answer.trim() == "go right") {
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
  console.log(
    `Commands:\nread | look around | take | backward | display inventory`
  );
  console.log(`You have entered this decrepit old house.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(houseLeftRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      houseLeftRoom.openToolbox();
      houseLeftRoom.revealMap();
      let mapQuestion = await ask(`Do you want to take the map?`);
      if (mapQuestion.trim() === "take" || mapQuestion.trim() === "take map") {
        houseLeftRoom.sendItems();
      }
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() == "backward") {
      //This will send you back to roomOne
      console.log(
        "\nYou exit the house and walk back outside to the street\n>_"
      );
      nextStreetRoomTwo();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

async function nextHouseRightRoom() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n`
  );
  console.log(`You entered the nice house.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(houseRightRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer.trim() === "take") {
      houseRightRoom.sendItems();
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log("\nYou walk back out into the street.\n>_");
      nextStreetRoomTwo();
    } else if (answer.trim() === "forward") {
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
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n
    go left` 
  );
  console.log(
    `You enter the plane and immediately notice a thick odor hanging the air.\nIt looks like something or someone has been living in here.\nYou notice a dark hole in the floor that leads to the bowels of plane. A clear path leads towards the cockpit.`
  );
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(planeRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(`There's nothing to take`);
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log("You exit the plane and head back towards the street.\n>_");
      nextStreetRoomTwo();
    } else if (answer.trim() === "forward") {
      console.log("You walk towards the cockpit\n>_");
      nextCockpitRoom();
    } else if (answer.trim() == "go left") {
      console.log("You nervously begin to climb down into the bowels.\n>_");
      nextCargoRoom();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//cockpit room
async function nextCockpitRoom() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n`
  );
  console.log(`You head down the aisle and enter the cockpit`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(cockpitRoom.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(
        `It seems the radio is attached to the wall.\nMaybe if you had a screwdriver you take it off.`
      );

    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log("You leave the cockpit and head back down the aisle\n>_");
      nextPlaneRoom();
    } else if (answer.trim() === "forward") {
      console.log(
        "Climbing out of this window is no problem.\nThat ladder leading into a giant hole in the earth is another matter entirely.\n>_"
      );
      nextCaveEntrance();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//cargo room
async function nextCargoRoom() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n` 
  );
  console.log(`Geeze it's dark down here.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(cargoRoom.read());
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    } else if (answer.trim() === "take"){
      console.log("It's so dark in here. I can't find anything to take.")
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log("Great decision. You climb out of that dank hole.\n>_");
      nextPlaneRoom();
    }
    else if  (answer.trim() === "forward") {
      //This will send you back to roomOne
      console.log("You walk forward and smash your head on something. Perhaps you should go back.\n>_");
    }  else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}
//Cave Entrance
async function nextCaveEntrance() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n` 
  );
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(caveEntrance.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(`Take what?`);
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log(
        "You look up and see the sky. Heave a sigh, and begin to climb.\n>_"
      );
      nextCockpitRoom();
    } else if (answer.trim() === "forward") {
      console.log("You head down the path towards another possible cave.\n>_");
      nextCaveOne();
    }
     else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//Cave One
async function nextCaveOne() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n` 
  );
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
    else if (answer === "take") {
      console.log(
        `Why in the hell at this point in the adventure would you want a rock.`
      );
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log(
        "Well I don't know if I can fit back through that space, but it's better than being in a pitch black scary cave."
      );
      nextCaveEntrance();
    } else if (answer.trim() === "forward") {
      console.log("You start walking towards the light.\n>_");
      nextCaveTwo();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}

//Cave Two and Final Room

async function nextCaveTwo() {
  console.log(
    `Commands:\nread | look around | take | forward | backward | display inventory\n` 
  );
  console.log(caveTwo);
  console.log(`An eerie sound blankets the air. An electric buzz or a hum. Or both.`);
  answer = await ask(prompt);

  while (answer.trim() !== true) {
    if (answer.trim() === "look around") {
      console.log(caveTwo.read());
    }
    ///Add specific item from specific room to player inventory
    else if (answer === "take") {
      console.log(`You can't carry rocks with you.`);
    } else if (answer === "display inventory") {
      console.log("You have these items in your inventory:");
      player.inventory.forEach(function (item) {
        console.log(item);
      });
    } else if (answer === "read") {
      if (player.inventory.includes("notebook")) {
        console.log(
          `There is writing in it but it seems to be in some other language\nThere are also drawings that look like hooded figures in a cave.....weird`
        );
      } else {
        console.log(`I don't have anything to read.`);
      }
    }
    //Exit Room
    else if(answer.trim() === "forward"){
      console.log("The orb seems to breathe, growing larger and larger. The light becomes brighter and brighter until the you can't bear to open your eyes again. Suddenly, you feel a wave of ecstacy wash over you. This is meant to be. It always was meant to be. You walk towards the orb and become one with it. You don a robe and kneel with the rest of the figures. Your sense of adventure compels you to stay right here. Where you've always belonged. ")
      process.exit()
    }
    else if (answer.trim() === "backward") {
      //This will send you back to roomOne
      console.log(
        "After everything you've been through you're going to back out now?\nHave fun starting over."
      );
      start();
    } else {
      console.log(`Sorry I don't know how to ${answer}.`);
    }
    answer = await ask(">_");
  }
}
