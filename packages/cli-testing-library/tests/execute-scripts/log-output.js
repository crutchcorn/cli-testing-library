import pc from "picocolors";

console.log("__disable_ansi_serialization");

// eslint-disable-next-line prefer-template
console.log(pc.blue("Hello") + " World" + pc.red("!"));
