const { ethers } = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
// Set up provider with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// Set up the contract interface
const contractAddress = "0xeF71Ddc12Bac8A2ba0b9068b368189FFa2628942";
const contractABI = [
  { type: "constructor", stateMutability: "nonpayable", inputs: [] },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claim",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "claimAmount",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "received",
    inputs: [{ type: "address", name: "", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setClaimAmount",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "usdc",
    inputs: [],
  },
];

async function claimTokens(privateKey, id) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const tx = await contract.claim(); // Call the claimTokens function of your smart contract
    await tx.wait(); // Wait for the transaction to be mined
    console.log(
      `Tokens claimed https://blockscout.scroll.io/tx/${tx.hash} id: ${id} `
    );
  } catch (error) {
    console.error("Error claiming tokens:", error);
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Specify the private keys and the number of times you want to claim tokens
const configFile = "config.json";
const claimConfigurations = JSON.parse(fs.readFileSync(configFile, "utf8"));
// Amount in token's smallest unit (e.g., wei)

// Call the validateEtherBalance function for each configuration
async function claimAllTokens() {
  try {
    for (const config of claimConfigurations) {
      await claimTokens(config.privateKey, config.id);
      await delay(10000);

      console.log(
        `account address: ${config.address} successfully running with id: ${config.id} `
      );
    }
  } catch (error) {
    console.error("Error claiming tokens:", error);
  }
}
// Call the claimAllTokens function
module.exports = claimAllTokens;
