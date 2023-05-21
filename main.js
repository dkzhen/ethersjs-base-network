const sendUSDC = require("./SendUSDC");
const sendUSDT = require("./SendUSDT");
const sendWBTC = require("./SendWBTC");
const sendEther = require("./SendEther");
const claimAllTokens = require("./MultiClaim");

async function sendBatch() {
  try {
    //await sendEther();
    console.log("Success send all ETH");
    //await claimAllTokens();
    console.log("success claim All Account");
    await sendUSDC();
    console.log("Success send all USDC");
    await sendUSDT();
    console.log("Success send all USDT");
    await sendWBTC();
    console.log("Success send all WBTC");
  } catch (error) {}
}

sendBatch();
