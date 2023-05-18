const { ethers } = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
// Set up provider with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// Set up the contract interface
const contractAddress = process.env.SC;
const contractABI = [
  // Replace this with the ABI of your smart contract

  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "claimer",
        type: "address",
      },
    ],
    name: "ClaimFaucet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "approveAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function claimTokens(privateKey, numClaims) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    for (let i = 0; i < numClaims; i++) {
      const tx = await contract.claim(); // Call the claimTokens function of your smart contract
      await tx.wait(); // Wait for the transaction to be mined
      console.log(`Tokens claimed - Claim ${i + 1}`);
    }
    console.log(`All tokens claimed successfully! Total claims: ${numClaims}`);
  } catch (error) {
    console.error("Error claiming tokens:", error);
  }
}

// Specify the private keys and the number of times you want to claim tokens
const configFile = "config.json";
const claimConfigurations = JSON.parse(fs.readFileSync(configFile, "utf8"));

console.log(claimConfigurations);
// Call the claimTokens function for each configuration
async function claimAllTokens() {
  try {
    for (const config of claimConfigurations) {
      await claimTokens(config.privateKey, config.numClaims);
    }
  } catch (error) {
    console.error("Error claiming tokens:", error);
  }
}

// Call the claimAllTokens function
claimAllTokens();
setTimeout(() => {
  claimAllTokens();
}, 25 * 60 * 60 * 1000);