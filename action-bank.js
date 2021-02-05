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
  
//     showInventory(){
//         let showInventory = await ask("Test to bring up inventory.")
        
//         if (showInventory === "show inventory") {
//             console.log("You have these items in your inventory:")
//             player.inventory.forEach(function(item){
//                 console.log(item)
//             })
//         } else {
//             console.log("I don't understand that input")
//         }
//         }
        
  };
  
//Push items into the inventory//
player.inventory.push("book", "flashlight", "red button")
console.log(player.inventory)


let actionBank = {
//add to inventory
    take: ["take", "pick up", "add to", "put in inventory"],
    drop: ["drop"],
    exit: ["open door", "exit room", "leave"],
  };
//Call Function//

actionBankTest()
  
async function actionBankTest() {
    let input = await ask (`Input some text - try take\n`)
    if (input.includes(
        actionBank.take.forEach(action))){
        player.inventory.push("new item")
    }
}

console.log(player.inventory)

//Now we can insert function into player object and link it to a key word


