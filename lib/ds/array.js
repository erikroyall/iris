module.exports = {
  "array.init": function (args, state, code) {
    state.arrs[args[0]] = [];
    return 0;
  },
  "array.push": function (args, state, code) {
    return state.arrs[args[0]].push(...args.slice(1));
  },
  "array.pop": function (args, state, code) {
    return state.arrs[args[0]].pop();
  },
  "array.shift": function (args, state, code) {
    return state.arrs[args[0]].shift();
  },
  "array.unshift": function (args, state, code) {
    return state.arrs[args[0]].unshift(...args.slice(1));
  },
  "array.get": function (args, state, code) {
    return state.arrs[args[0]][+args[1]];
  },
  "array.length": function (args, state, code) {
    return state.arrs[args[0]].length;
  }
}
