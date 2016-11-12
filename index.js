function parse(code) {
  const flow = [];
  const state = {
    expectingNextLine: false
  };

  // Remove blank lines and generate an array containing
  // each line of code
  const xcode = 
  code
  .split("\n")
  .map(line => line.trim())
  .filter(line => line !== "");

  for (let cur = 0; cur < xcode.length; cur++) {
    const line = xcode[cur];

    const xline =
    line
    .split(" ")
    .map(op => op.trim())
    .filter(op => op !== "");

    // Check for labels
    if (xline[0].split(":").length === 2) {
      // Check if previous statement was a LabelExpression
      if (state.expectingNextLine) {
        console.error("Expected a FunctionApplication, encountered a LabelExpression");
        break;
      }

      // Check if this is the last line of code
      if (cur + 1 === xcode.length) {
        console.error("Expected a FunctionApplication, reached end of input");
        break;
      }

      flow.push({
        line: cur,
        type: "LabelExpression",
        code: xline[0],
        name: xline[0].split(":")[0],
        pointsTo: cur + 1
      });

      // If it's a label, next label must be a FunctionApplication
      state.expectingNextLine = true;
      continue;
    }

    flow.push({
      line: cur,
      type: "FunctionApplication",
      code: xline.join(" "),
      name: xline[0],
      args: xline.slice(1)
    });
    state.expectingNextLine = false;
  }

  return flow;
}

var handlers = {
  add: function addHandler (args) {
    return args.reduce((acc,cur) => +acc + +cur);
  },
  sub: function subHandler (args) {
    return args.reduce((acc,cur) => +acc - +cur);
  },
  mul: function mulHandler (args) {
    return args.reduce((acc,cur) => +acc * +cur);
  },
  div: function divHandler (args) {
    return args.reduce((acc,cur) => +acc / +cur);
  },
  print: function printHandler (args, state) {
    let out = "";

    args.forEach(function (arg) {
      if (arg === "%ln") {
        out += "\n"
      } else if (arg[0] === ":") {
        out += state.vars[arg.slice(1)] + " ";
      } else if (arg[0] === "%") {
        out += state.data[arg.slice(1)] + " ";
      } else {
        out += arg + " ";
      }
    });

    state.output += out;
    return 0;
  },
  let: function letHandler (arg, state, code) {
    if (arg.length !== 2) {
      console.error("let() takes 2 parameters, " + arg.length + " passed");
      console.error(code);
      console.error("    ^");
      return -1;
    }

    else if (arg[1][0] === ":") {
      state.vars[arg[0]] = state.vars[arg[1].slice(1)];
    } else if (arg[1][0] === "%") {
      state.vars[arg[0]] = state.data[arg[1].slice(1)];
    } else {
      state.vars[arg[0]] = arg[1];
    }

    return 0; 
  }
};

function evaluate(tree, prevState) {
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
      
      // call the handler
      state.data.retval = handlers[ins.name](ins.args, state, ins.code);
    }
  }

  return state;
}

module.exports = {
  evaluate: evaluate,
  parse: parse
};

