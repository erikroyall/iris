module.exports = {
  "array.init": function (args, state, code, rargs) {
    state.arrs[rargs[0]] = [];
    return 0;
  },
  "array.push": function (args, state, code, rargs) {
    return state.arrs[rargs[0]].push(...rargs.slice(1));
  },
  "array.pop": function (args, state, code, rargs) {
    return state.arrs[rargs[0]].pop();
  },
  "array.shift": function (args, state, code, rargs) {
    return state.arrs[rargs[0]].shift();
  },
  "array.unshift": function (args, state, code, rargs) {
    return state.arrs[rargs[0]].unshift(...rargs.slice(1));
  },
  "array.get": function (args, state, code, rargs) {
    return state.arrs[rargs[0]][+rargs[1]];
  },
  "array.set": function (args, state, code, rargs) {

    return state.arrs[rargs[0]][+rargs[1]] = rargs[2];
  },
  "array.length": function (args, state, code, rargs) {
    return state.arrs[rargs[0]].length;
  },
  "array.tostring": function (args, state, code, rargs) {
    console.log(state.arrs[args[0]]);
  }
}
