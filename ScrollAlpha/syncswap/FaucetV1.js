const transferFee = require("./utils/BatchSendETH");
const BatchTransfer = require("./utils/BatchTransfer");
const claimAllTokens = require("./utils/ClaimUSDC");

async function FaucetV1() {
  await transferFee();
  delay(25000);
  await claimAllTokens();
  await BatchTransfer();
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
module.exports = FaucetV1;
