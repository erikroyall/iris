module.exports = {
  "math.abs": function (args, state, code) {
    return Math.abs(+args[0]);
  },
  "math.random": function (args, state, code) {
    return Math.random();
  }
}