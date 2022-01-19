var exec = require("child_process").execFile;
const jsonfile = require("jsonfile");
const fs = require("fs");

class Queue {
  queue = [];

  addItem = (obj) => {
    this.queue.push(obj);
  };

  run = (dirs) => {
    const dir = dirs;
    if (this.queue.length === 0) {
      console.log("Queue is empty, nothing to do");
      return;
    }

    const item = this.queue[0];
    const { name, ext } = item;

    const f = fs;

    const dirToPut = "Swearless\\";

    if (!fs.existsSync(dir + dirToPut)) {
      fs.mkdirSync(dir + dirToPut);
    }

    const jsonObj = [
      "-o",
      `${dir + "swearless\\" + name}.mkv`,
      "--language",
      `${0}:eng`,
      "--track-name",
      `${1}:Original`,
      `${dir + name}${ext}`,
      "--language",
      `${0}:eng`,
      "--track-name",
      `${1}:Swearless`,
      "--no-video",
      `${dir + name}_SL..mp4`,
      "--default-track",
      "0",
    ];

    jsonfile.writeFileSync("./options.json", jsonObj);
    console.log("Options file created, executing mkvmerge...");

    exec(`./bin/mkvmerge.exe`, ["@options.json"], function (err, data) {
      console.log(err);
      console.log(data.toString());
    }).on("exit", (code, signal) => {
      console.log("code", code);
      //When done, remove from queue and go to the next one.
      this.queue.shift();
      if (this.queue.length > 0) {
        this.run(dirs);
      } else {
        console.log("Job finished");
      }
    });
  };
}

module.exports = Queue;
