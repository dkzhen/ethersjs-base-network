const FaucetV1 = require("./syncswap/FaucetV1");
const axios = require("axios");
const fs = require("fs");
const chokidar = require("chokidar");
const config = require("../config");

const resultFilePath = "result.json";

let resultJson = null;

// Read and parse the initial JSON data from the file
try {
  const fileData = fs.readFileSync(resultFilePath, "utf8");
  resultJson = JSON.parse(fileData);
} catch (error) {
  console.error("Error reading JSON file:", error);
}

const webhookUrl =
  "https://discord.com/api/webhooks/1110934381872300103/uONGg3CK-bpRrr_WK4GOX75CsLtqQv7jzfG2N4x5BXYD--w4_UY3UgqJY3AC0vQGyxqP";

async function main() {
  try {
    await FaucetV1();
    // Read the updated JSON data after a delay
    setTimeout(async () => {
      const fileData = fs.readFileSync(resultFilePath, "utf8");
      resultJson = JSON.parse(fileData);

      const txid = resultJson.map((obj) => obj.tx);
      const total = resultJson.map((obj) => obj.total);

      const message = `Bot successfully claimed! message from screen ${config.nameFile} Total ${total} account. Hash: https://blockscout.scroll.io/tx/${txid}`;
      await sendDiscordAlert(message);
      // console.log(message);
    }, 2000); // Adjust the delay time as needed
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendDiscordAlert(message) {
  try {
    await axios.post(webhookUrl, { content: message });
    console.log("Discord alert sent successfully");
  } catch (error) {
    console.error("Error sending Discord alert:", error);
  }
}

// Watch the JSON file for changes
chokidar.watch(resultFilePath).on("change", (event, path) => {
  console.log("JSON file changed:", path);

  // Delay the read operation after detecting the change
  setTimeout(() => {
    try {
      const fileData = fs.readFileSync(resultFilePath, "utf8");
      resultJson = JSON.parse(fileData);
      console.log("Updated JSON data:", resultJson);
    } catch (error) {
      console.error("Error reading JSON file:", error);
    }
  }, 2000); // Adjust the delay time as needed
});

main();
