const { Emitter } = require("./emitter");

const emitter = new Emitter();
emitter.AddEvent("1", function (a, b) { console.log(a + b) });

emitter.Emit("1", 3, 4);