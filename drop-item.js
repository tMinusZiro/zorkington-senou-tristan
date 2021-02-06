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

// //Player Object
// let player = {
//   status: {
//     defaultStatus: ["awake"],
//     nextStatus: ["sleep", "brave", "scared"],
//   },

//   inventory: [],

//   playerStatus: function () {},

//   playerInventory: function () {},

//   displayInventory: function () {
//     console.log(this.inventory);
//   },
// };

// //Push items into the inventory//
// player.inventory.push("book", "flashlight", "red button");
// console.log(player.inventory);

// //Call Function//
// dropItem();

// async function dropItem() {
//   let answer = await ask("Type Drop Item.");

//   if (answer.trim() === "drop") {
//     let dropItem = await ask("Drop which item?");

//     if (player.inventory.includes(dropItem)) {
//       dropIt();

//     } else {
//         console.log("You don't have this item.")
//     }
//   } else {
//     console.log("I don't understand that input");
//   }
// }

// function dropIt(dropItem) {
//         console.log(player.inventory.indexOf(dropItem))

//         player.inventory.splice(-1, 1, (dropItem));
//         console.log(player.inventory);
// }

let numArr = ["one", "two", "three", "four"];

let answer;
let input
let numberInput;

dropNumberFunction();

async function dropNumberFunction() {
  answer = await ask(">_");
  input  =  answer.trim();
  while (input.trim() !== true) {
    if (input.trim() === "drop item") {
      console.log("You typed 'drop item'");
      numberInput = await ask("Drop what?");
      if (numArr.includes(numberInput)) {
        console.log("Input = " + numberInput)
        dropNumber();
      } else {
        console.log("You don't have that");
      }
    } else {
      console.log("I don't understand that input");
    }
    input = await ask(">_");
  }
}

function dropNumber() {
    numArr.splice(1, numArr.indexOf(numberInput))
    console.log(numArr)

}



