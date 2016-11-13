module.exports = {
  "console.log": function (args, state, code) {
    console.log(...args);
  },
  "console.error": function (args, state, code) {
    console.error(...args);
  }
};
