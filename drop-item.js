//Libraries//
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

//Player Object
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

//Push items into the inventory//
player.inventory.push("book", "flashlight", "red button");
console.log(player.inventory);

//Call Function//
dropItem();

async function dropItem() {
  let answer = await ask("Type Drop Item.");

  if (answer.trim() === "drop") {
    let dropItem = await ask("Drop which item?");
    if (player.inventory.includes(dropItem)) {
        (console.log(dropItem))
      player.inventory.splice(0, 1, dropItem);
      return player.inventory;
      //currentRoom.push(dropItem)
    }
    console.log(player.inventory)
  } else {
    console.log("I don't understand that input");
  }

;
}

