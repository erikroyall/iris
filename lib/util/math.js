module.exports = {
  "math.abs": function (args, state, code) {
    return Math.abs(+args[0]);
  },
  "math.random": function (args, state, code) {
    return Math.random();
  },
  "math.pow": function (args, state, code) {
    return Math.pow(+args[0], +args[1]);
  },
  "math.sin": function (args, state, code) {
    return Math.sin(+args[0]);
  },
  "math.cos": function (args, state, code) {
    return Math.cos(+args[0]);
  },
  "math.tan": function (args, state, code) {
    return Math.tan(+args[0]);
  },
  "math.asin": function (args, state, code) {
    return Math.asin(+args[0]);
  },
  "math.acos": function (args, state, code) {
    return Math.acos(+args[0]);
  },
  "math.atan": function (args, state, code) {
    return Math.atan(+args[0]);
  },
  "math.sinh": function (args, state, code) {
    return Math.sinh(+args[0]);
  },
  "math.cosh": function (args, state, code) {
    return Math.cosh(+args[0]);
  },
  "math.tanh": function (args, state, code) {
    return Math.tanh(+args[0]);
  },
  "math.asinh": function (args, state, code) {
    return Math.asinh(+args[0]);
  },
  "math.acosh": function (args, state, code) {
    return Math.acosh(+args[0]);
  },
  "math.atanh": function (args, state, code) {
    return Math.atanh(+args[0]);
  },
  "math.log": function (args, state, code) {
    return Math.log(+args[0]);
  },
  "math.log2": function (args, state, code) {
    return Math.log2(+args[0]);
  },
  "math.log10": function (args, state, code) {
    return Math.log10(+args[0]);
  },
  "math.exp": function (args, state, code) {
    return Math.exp(+args[0]);
  },
  "math.floor": function (args, state, code) {
    return Math.floor(+args[0]);
  },
  "math.ceil": function (args, state, code) {
    return Math.ceil(+args[0]);
  },
  "math.sqrt": function (args, state, code) {
    return Math.sqrt(+args[0]);
  },
  "math.round": function (args, state, code) {
    return Math.round(+args[0]);
  }
}