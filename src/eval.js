const helpers = require("./helpers");
const handlers = require("./handlers");
const fs = require("fs");
const parse = require("./parser");

module.exports = function evaluate(tree, prevState) {
  const labelTable = {};
  let state;

  if (typeof prevState === "object" && prevState !== null) {
    state = prevState;
  } else {
    state = {
      output: "",
      vars: {}, // Program-defined variables
      data: {
        retval: null  
      }
    }
  };

  // Populate the label table
  for (let cur = 0; cur < tree.length; cur++) {
    let ins = tree[cur];
    if (ins.type === "LabelExpression") {
      labelTable[ins.name] = ins.pointsTo;
    }
  }

  for (let cur = 0; cur < tree.length; cur++) {
    let ins = tree[cur];
    if (ins.type === "FunctionApplication") {
      // handle goto
      if (ins.name === "goto") {
        cur = labelTable[ins.args[0]] - 1;
        continue;
      }

      // handle if
      if (ins.name === "if") {
        let resolved = helpers.resolve(ins.args, state);
        if (helpers.test(resolved[0], resolved[1], resolved[2])) {
          if (ins.args[3] === "goto") {
            cur = labelTable[ins.args[4]] - 1;
          } else {
            state = evaluate(parse(ins.args.slice(3).join(" ")), state);    
          }
        }
        continue;
      }

      // handle @include
      if (ins.name === "@include") {
        if (fs.existsSync(ins.args[0])) {
          const contents = fs.readFileSync(ins.args[0]).toString();
          state = evaluate(parse(contents), state);0
        } else {
          console.error("Module " + ins.args[0] + " does not exist");
          break;
        }
        continue;
      }
      
      // call the handler
      if (typeof handlers[ins.name] === "function") {
        state.data.retval = handlers[ins.name](ins.args, state, ins.code);
      } else {
        console.error("Function " + ins.name + " doesn't exist");
        console.error(ins.code);
        console.error("^");
      }
    }
  }

  return state;
};
