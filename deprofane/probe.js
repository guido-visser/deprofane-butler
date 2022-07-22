var ffmpeg = require("fluent-ffmpeg");
const selectAudioChannel = require("./selectAudioChannel");
const process = require("./process");

const probe = (path) => {
  let audioChannels = [];
  ffmpeg.ffprobe(path, async (err, metadata) => {
    if (err) {
      console.log("ERROR");
      console.log(err);
    } else {
      metadata.streams.forEach((stream, index) => {
        if (stream.codec_type === "audio") {
          audioChannels.push(stream);
        }
      });
      const ac = await selectAudioChannel(audioChannels);
      process(path, ac);
    }
  });
};

module.exports = probe;
