const { ethers } = require("ethers");
const readline = require("readline");
const dotenv = require("dotenv");
dotenv.config();
// Set up provider and signer with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user for their private key
function promptForPrivateKey() {
  return new Promise((resolve, reject) => {
    rl.question("Enter your private key: ", (privateKey) => {
      rl.close();
      resolve(privateKey);
    });
  });
}

async function claimTokens(privateKey, numClaims) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);

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
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    // Set up the contract instance
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

async function runAutoClaim() {
  const privateKey = await promptForPrivateKey();

  // Specify the number of times you want to claim tokens
  const numberOfClaims = 20;

  // Call the claimTokens function with the specified number of claims and user's private key
  claimTokens(privateKey, numberOfClaims);
}

// Start the auto-claim process
runAutoClaim();
