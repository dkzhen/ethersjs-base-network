const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

let txNumber = 0; // Initialize the transaction number

async function sendEtherSingle(balance, address) {
  const amountToSend = ethers.utils.parseEther(balance); // Amount of Ether to send

  try {
    const nonce = await provider.getTransactionCount(wallet.address);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    const gasPrice = ethers.utils.parseUnits("10", "gwei"); // Set a higher gas price, e.g., 10 gwei

    const currentNonce = nonce;

    const tx = {
      nonce: currentNonce,
      to: address,
      value: amountToSend,
      chainId: chainId, // Specify the chainId for EIP-155
      gasPrice: gasPrice, // Set the gas price
    };

    const gasLimit = await wallet.estimateGas(tx); // Estimate the gas limit
    tx.gasLimit = gasLimit;

    const signedTx = await wallet.signTransaction(tx);
    const sentTx = await provider.sendTransaction(signedTx);

    txNumber++; // Increment the transaction number
    console.log(`Transaction ${txNumber} sent to ${address}: ${sentTx.hash}`);
  } catch (error) {
    console.error(`Error sending Ether:`, error);
  }
}

module.exports = sendEtherSingle;
