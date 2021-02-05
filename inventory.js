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
player.inventory.push("book", "flashlight", "red button")
console.log(player.inventory)

//Call Function//
showInventory()
  
async function showInventory(){
let showInventory = await ask("Test to bring up inventory.")

if (showInventory === "show inventory") {
    console.log("You have these items in your inventory:")
    player.inventory.forEach(function(item){
        console.log(item)
    })
} else {
    console.log("I don't understand that input")
}
}


//Now we can insert function into player object and link it to a key word


