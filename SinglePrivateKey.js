const { ethers } = require("ethers");
const readline = require("readline");
const dotenv = require("dotenv");
dotenv.config();
// Set up provider and signer with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(
  "https://fragrant-necessary-orb.matic-testnet.discover.quiknode.pro/bbeef04b2401372f6ec173ad6bc081cf52839710/"
);

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

async function batchClaimTokens(privateKey, numClaims) {
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
async function claimTokens(privateKey) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);

    // Set up the contract interface
    const contractAddress = "0xe9DcE89B076BA6107Bb64EF30678efec11939234";
    const contractABI = [
      {
        constant: false,
        inputs: [
          {
            name: "wallet",
            type: "address",
          },
          {
            name: "buyer",
            type: "address",
          },
          {
            name: "tokenAmount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    // Set up the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    const addWallet = "0xe9DcE89B076BA6107Bb64EF30678efec11939234";
    const addBuyer = "0x3cFDF1A69b32e67547F3Ecbfd4d93a904Fd77431";
    const tokenAmount = ethers.BigNumber.from("10000000000");
    const gasLimit = 60000; // Adjust the gas limit as needed
    const gasPrice = ethers.utils.parseUnits("35", "gwei"); // Adjust the gas price as needed

    const tx = await contract.mint(addWallet, addBuyer, tokenAmount, {
      gasLimit,
      gasPrice,
    });
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Tokens claimed ${tx.hash} `);

    // console.log(`All tokens claimed successfully! Total claims: ${numClaims}`);
  } catch (error) {
    console.error("Error claiming tokens:", error);
  }
}

async function runAutoClaim() {
  const privateKey =
    "6ea77acb504b833fe377abecb01e726f8c908d217e0a4ce1a4ac576caaa73261";

  // Specify the number of times you want to claim tokens
  // const numberOfClaims = 20;

  // Call the claimTokens function with the specified number of claims and user's private key

  claimTokens(privateKey);
}

// Start the auto-claim process
runAutoClaim();
