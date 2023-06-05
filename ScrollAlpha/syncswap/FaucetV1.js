const transferFee = require("./utils/BatchSendETH");
const BatchTransfer = require("./utils/BatchTransfer");
const claimAllTokens = require("./utils/ClaimUSDC");

async function FaucetV1() {
  // await transferFee();
  await claimAllTokens();
  await BatchTransfer();
}
module.exports = FaucetV1;
