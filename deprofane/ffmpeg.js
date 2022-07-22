var fluent = require("fluent-ffmpeg");

const executeFfmpeg = (args) => {
  let command = fluent().output(" "); // pass "Invalid output" validation
  command._outputs[0].isFile = false; // disable adding "-y" argument
  command._outputs[0].target = ""; // bypass "Unable to find a suitable output format for ' '"
  command._global.get = () => {
    // append custom arguments
    return typeof args === "string" ? args.split(" ") : args;
  };
  return command;
};

module.exports = executeFfmpeg;
