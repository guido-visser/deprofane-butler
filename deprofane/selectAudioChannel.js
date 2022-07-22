const inquirer = require("inquirer");

const selectAudioChannel = async (audioChannels) => {
  let ac = null;
  if (audioChannels.length > 1) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "ac",
        message: `${audioChannels.length} audio channels found. Please select which one to use`,
        choices: audioChannels.map(
          (ch, i) =>
            `${i}: ${ch.tags?.title ? ch.tags.title : ""} ${
              ch.tags?.language
            } ${ch.codec_name} ${ch.channel_layout}`
        ),
      },
    ]);
    const index = answer.ac.split(":")[0];
    ac = audioChannels[index];
  }
  if (!ac) {
    ac = audioChannels[0];
  }
  return ac;
};

module.exports = selectAudioChannel;
