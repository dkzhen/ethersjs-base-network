const axios = require("axios");
const sendUSDC = require("./SendUSDC");
const sendUSDT = require("./SendUSDT");
const sendWBTC = require("./SendWBTC");
const sendEther = require("./SendEther");
const claimAllTokens = require("./MultiClaim");

const balance = "0.005";

// Discord webhook URL
const webhookUrl =
  "https://discord.com/api/webhooks/1110934381872300103/uONGg3CK-bpRrr_WK4GOX75CsLtqQv7jzfG2N4x5BXYD--w4_UY3UgqJY3AC0vQGyxqP";

async function sendBatch() {
  try {
    //await sendEther(balance);
    console.log("Success send all ETH");
    await claimAllTokens();
    console.log("Success claim All Account");
    await sendUSDC();
    console.log("Success send all USDC");
    await sendUSDT();
    console.log("Success send all USDT");
    await sendWBTC();
    console.log("Success send all WBTC");

    // Send Discord alert
    const message = "Bot successfully claimed all tokens! happy cheating!";
    await sendDiscordAlert(message);
  } catch (error) {
    console.error(error);
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

sendBatch();
