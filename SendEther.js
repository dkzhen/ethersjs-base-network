const { ethers } = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const jsonData = fs.readFileSync("config.json");
const data = JSON.parse(jsonData);

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

async function sendEther() {
  const amountToSend = ethers.utils.parseEther("0.0001"); // Amount of Ether to send

  for (const item of data) {
    const address = item.address;

    try {
      const tx = await wallet.sendTransaction({
        to: address,
        value: amountToSend,
      });

      console.log(`Transaction sent: ${tx.hash}`);
    } catch (error) {
      console.error(`Error sending Ether to ${address}:`, error);
    }
  }
}

sendEther();
