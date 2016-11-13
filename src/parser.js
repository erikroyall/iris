const helpers = require("./helpers");

module.exports = function (code) {
  const flow = [];
  const state = {
    expectingNextLine: false
  };

  // Remove blank lines and generate an array containing
  // each line of code
  const xcode = helpers.cleanCode(code);

  for (let cur = 0; cur < xcode.length; cur++) {
    const line = xcode[cur];
    const xline = helpers.cleanLine(line);

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
};
