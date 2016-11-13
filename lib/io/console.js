module.exports = {
  "console.log": function (args, state, code, rargs) {
    console.log(...rargs);
  },
  "console.error": function (args, state, code, rargs) {
    console.error(...rargs);
  }
};
