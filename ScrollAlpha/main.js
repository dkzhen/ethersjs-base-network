const FaucetV1 = require("./syncswap/FaucetV1");
const axios = require ("axios")
async function main() {
  try {
    await FaucetV1();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
const FaucetV1 = require("./syncswap/FaucetV1");

const webhookUrl =
  "https://discord.com/api/webhooks/1110934381872300103/uONGg3CK-bpRrr_WK4GOX75CsLtqQv7jzfG2N4x5BXYD--w4_UY3UgqJY3AC0vQGyxqP";

async function main() {
  try {
    await FaucetV1();
    const message = "Bot successfully claimed all tokens! happy cheating!";
    await sendDiscordAlert(message);
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
main();
