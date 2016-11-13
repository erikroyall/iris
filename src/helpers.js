module.exports = {
  cleanCode: function (c) {
    return c.split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");
  },
  cleanLine: function (l) {
    return l.split(" ")
      .map(op => op.trim())
      .filter(op => op !== "");
  },
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