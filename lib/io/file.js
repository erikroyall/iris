const fs = require("fs");

module.exports = {
  "fs.readfile": function (args, state, code) {
    return fs.readFileSync(args[0], args[1] || "utf8").toString();
  }
};
