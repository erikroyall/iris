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

const helpers = {
  resolve: function (args, state) {
    return args.map(function (arg) {
      const head = arg[0], tail = arg.slice(1);
      if (arg === "%ln") {
        return "\n";
      } else if (head === ":") {
        return state.vars[tail];
      } else if (head === "%") {
        return state.data[tail];
      } else {
        return arg;
      }
    });
  }, checkargs: function (code, provides, rel, argc, name) {
    let cond, relstring;
    switch (rel) {
      case ">":
        cond = provides > argc;
        relstring = "greater than";
        break;
      case "<":
        cond = provides < argc;
        relstring = "less than";
        break;
      case "==":
        cond = provides === argc;
        relstring = "exactly";
        break;
      case "!=":
        cond = provides !== argc;
        relstring = "!=";
        break;
    }

    if (!cond) {
      console.error(name + " expects " + (relstring ? relstring + " " : "") + argc + " arguments, " + provides + " provided");
      console.error(code);
      console.error(" ".repeat(name.length + 1) + "^");
      return false;
    }

    return true;
  }, toBool: function (a) {
    return a === "true";
  }, test: function (a, op, b) {
    let ab = this.toBool(a), bb = this.toBool(b);
    switch (op) {
      case "=": return +a === +b; break;
      case "!=": return +a !== +b; break;
      case "<": return +a < +b; break;
      case ">": return +a > +b; break;
      case ">=": return +a >= +b; break;
      case "<=": return +a <= +b; break;
      case "and":
      case "&&": return ab && bb; break;
      case "or":
      case "||": return ab || bb; break;
        //case "&": return +a & +b; break;
        //case "|": return +a | +b; break;
        //case "<<": return +a << +b; break;
        //case ">>": return +a >> +b; break;
    }
  }
};

const handlers = {
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
}

module.exports = {
  evaluate: evaluate,
  parse: parse
};

