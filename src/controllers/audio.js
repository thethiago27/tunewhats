const fs = require("fs");

async function convertAudioToFlac(base64, from) {

  fs.writeFileSync(`${from}.wav`, base64, { encoding: "base64" });

}

module.exports = {
  convertAudioToFlac
};