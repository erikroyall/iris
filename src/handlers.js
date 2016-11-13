const helpers = require("./helpers");

module.exports = {
  add: function addHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, ">", 1, "add")) return -1; 
    return helpers.resolve(args, state).reduce((acc,cur) => +acc + +cur);
  },
  sub: function subHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, ">", 1, "sub")) return -1;
    return helpers.resolve(args, state).reduce((acc,cur) => +acc - +cur);
  },
  mul: function mulHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, ">", 1, "mul")) return -1;
    return helpers.resolve(args, state).reduce((acc,cur) => +acc * +cur);
  },
  div: function divHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, ">", 1, "div")) return -1;
    return helpers.resolve(args, state).reduce((acc,cur) => +acc / +cur);
  },
  print: function printHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, ">", 0, "print")) return -1;
    state.output += helpers.resolve(args, state).join(" ");
    return 0;
  },
  let: function letHandler (args, state, code) {
    if (!helpers.checkargs(code, args.length, "==", 2, "let")) return -1;

    if (args[1][0] === ":") {
      state.vars[args[0]] = state.vars[args[1].slice(1)];
    } else if (args[1][0] === "%") {
      state.vars[args[0]] = state.data[args[1].slice(1)];
    } else {
      state.vars[args[0]] = args[1];
    }

    return 0; 
  }
};
