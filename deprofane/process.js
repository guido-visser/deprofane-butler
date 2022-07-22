const inquirer = require("inquirer");
const cliProgress = require("cli-progress");
const executeFfmpeg = require("./ffmpeg");

const process = async (path, audioChannel) => {
  const bar1 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  let vocalsOnly = false;
  if (
    audioChannel.channel_layout === 5.1 ||
    audioChannel.channel_layout === 7.1
  ) {
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "vocalsOnly",
        message: "Multi-channel audio track found. Mute vocals only?",
        default: true,
      },
    ]);
    vocalsOnly = answer.vocalsOnly;
  }
  if (vocalsOnly) {
    let args = `-i ${path} `;
    let channels = [];
    if (audioChannel.channel_layout === 5.1) {
      channels = ["FL", "FR", "FC", "LFE", "BL", "BR"];
    }

    /* executeFfmpeg(args)
      .on("start", (command) => {
        console.log("Starting!", command);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", () => {
        console.log("FINISHED!");
      })
      .on("error", (err) => {
        console.log("FAAAALL!");
        console.log("");
        console.log(err);
      })
      .run(); */
  } else {
    ffmpeg(path)
      .outputOptions(["-acodec ac3", "-vn"])
      .on("start", (command) => {
        console.log("EXTRACTING AUDIO", command);
        bar1.start(100, 0);
      })
      .on("progress", (progress) => {
        bar1.update(Math.floor(progress.percent));
      })
      .on("end", () => {
        bar1.stop();
        console.log("FINISHED!");
      })
      .on("error", (err) => {
        console.log("FAAAALL!");
        console.log("");
        console.log(err);
      })
      .output("C:\\Video\\bloodshot\\audio.wav")
      .run();
  }
};

module.exports = process;

/**
 * '-map "[FL]" ./front_left.wav',
        '-map "[FR]" ./front_right.wav',
        '-map "[FC]" ./front_center.wav',
        '-map "[LFE]" ./lfe.wav',
        '-map "[BL]" ./back_left.wav',
        '-map "[BR]" ./back_right.wav',
 */
//ffmpeg -i "C:\Video\bloodshot\bloodshot.mp4" -filter_complex "channelsplit=channel_layout=5.1[FL][FR][FC][LFE][BL][BR]" -map "[FL]" fl.wav -map "[FR]" fr.wav -map "[FC]" fc.wav -map "[LFE]" lfe.wav -map "[BL]" bl.wav -map "[BR]" br.wav
//"channelsplit=channel_layout=5.1[FL][FR][FC][LFE][BL][BR]" -map "[FL]" ./fl.wav -map "[FR]" ./fr.wav -map "[FC]" fc.wav -map "[LFE]" lfe.wav -map "[BL]" bl.wav -map "[BR]" br.wav
