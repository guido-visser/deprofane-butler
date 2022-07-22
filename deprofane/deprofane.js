const yargs = require("yargs");
const config = require("../config.json");
var ffmpeg = require("fluent-ffmpeg");
const inquirer = require("inquirer");

const probe = require("./probe");

const fs = require("fs");

ffmpeg.setFfmpegPath(config.ffmpeg);
ffmpeg.setFfprobePath(config.ffprobe);

const run = async () => {
  const argv = yargs
    .option("path", {
      alias: "p",
      description: "Path to the video",
      type: "string",
    })
    .option("vocals-only", {
      alias: "vo",
      description: "Will use the an available 5.1 ",
    })
    .help()
    .alias("help", "h").argv;

  let audio = [];

  if (argv.path) {
    if (!fs.existsSync(argv.path)) {
      console.error("File not found");
      return;
    }
    audio = probe(argv.path);
  } else {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "videoPath",
        message: "Enter the path to the video",
      },
    ]);
    audio = probe(answers.videoPath);
  }
};

run();
