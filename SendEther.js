const { ethers } = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const jsonData = fs.readFileSync("config.json");
let data = JSON.parse(jsonData);

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

let txNumber = 0; // Initialize the transaction number

async function sendEther() {
  const amountToSend = ethers.utils.parseEther("0.001"); // Amount of Ether to send

  try {
    const nonce = await provider.getTransactionCount(wallet.address);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    const gasPrice = ethers.utils.parseUnits("10", "gwei"); // Set a higher gas price, e.g., 10 gwei

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const address = item.address;
      const id = item.id;

      const currentNonce = nonce + i;

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

      // Update the JSON data to mark the transaction as successfully sent
      data[i].sent = true;
      data[i].txHash = sentTx.hash;

      // Save the updated JSON data to the file
      fs.writeFileSync("config.json", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(`Error sending Ether:`, error);
  }
}

sendEther();
