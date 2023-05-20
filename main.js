const sendUSDC = require("./SendUSDC");
const sendUSDT = require("./SendUSDT");
const sendWBTC = require("./SendWBTC");
const sendEther = require("./SendEther");
const claimAllTokens = require("./MultiClaim");

const saldoUSDC = "12000";
const saldoUSDT = "12000";
const saldoWBTC = "0.008";
async function sendBatch() {
  try {
    // await sendEther();
    console.log("Success send all ETH");
    await claimAllTokens();
    console.log("success claim All Account");
    await sendUSDC(saldoUSDC);
    console.log("Success send all USDC");
    await sendUSDT(saldoUSDT);
    console.log("Success send all USDT");
    await sendWBTC(saldoWBTC);
    console.log("Success send all WBTC");
  } catch (error) {}
}

sendBatch();
