const transferFee = require("./utils/BatchSendETH");
const claimAllTokens = require("./utils/ClaimUSDC");

async function FaucetV1() {
  //await transferFee();
  await claimAllTokens();
}
module.exports = FaucetV1;
