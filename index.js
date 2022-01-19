const yargs = require("yargs");
const fs = require("fs");
const q = require("./queue");
const queue = new q();

const argv = yargs
  .option("directory", {
    alias: "d",
    description: "Full directory path to folder to merge",
    type: "string",
  })
  .option("merge", {
    alias: "m",
    description: "Merge audio track of file(s)",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

if (!argv.d) {
  console.log('You need to pass a directory path, use -d "PATH/TO/DIRECTORY"');
  return;
}
const dir = !argv.d.endsWith("\\") ? argv.d + "\\" : argv.d;

if (argv.merge) {
  console.log("Getting all files from given directory");
  const files = fs.readdirSync(dir).filter((file) => !file.endsWith(".srt"));

  let error = null;
  const oriFiles = files.filter((file) => !file.endsWith("_SL..mp4"));

  oriFiles.forEach((file) => {
    const name = file.slice(0, -4);
    const ext = file.slice(name.length);

    //check if the _SL version exists
    if (files.indexOf(name + "_SL..mp4") !== -1) {
      console.log(`Swearless version for ${name} found! Adding to queue!`);
      queue.addItem({ name, ext });
    } else {
      console.log(
        `No swearless version for ${name} found, please make sure the Swearless file ends with '_SL..mp4'`
      );
    }
  });

  console.log(`Queue of ${queue.queue.length}, starting the job...`);

  queue.run(dir);
}
