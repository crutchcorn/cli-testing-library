import inquirer from "inquirer";

inquirer.prompt([
  {
    type: "select",
    name: "value",
    message: "First option:",
    choices: ["One", "Two", "Three"],
  },
]);
