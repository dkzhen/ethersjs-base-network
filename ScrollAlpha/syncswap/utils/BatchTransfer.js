const ethers = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");
const config = require("../../../config");
dotenv.config();
// Set up provider with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

const contractAddress = "0x533EA99002a06C09685a345b9919dC36a8837675"; // Replace with the actual contract address
const privateKeyFilePath = config.nameFile; // Replace with the path to your JSON fi

// Load the private keys from the JSON file
const privateKeyJson = JSON.parse(fs.readFileSync(privateKeyFilePath, "utf8"));

// Create an array of wallets using the loaded private keys
const wallets = [];
const ids = [];
for (const key of privateKeyJson) {
  const wallet = new ethers.Wallet(key.privateKey, provider);
  wallets.push(wallet);
  const id = key.id;
  ids.push(id);
}

// Connect to the contract using the contract ABI and address
const abi = [
  { type: "constructor", inputs: [] },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "receiveUSDC",
    inputs: [
      { type: "address[]", name: "senders", internalType: "address[]" },
      { type: "uint256[]", name: "amounts", internalType: "uint256[]" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdrawUSDC",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }],
  },
];
const contract = new ethers.Contract(contractAddress, abi, wallets[0]);

// Define the senders' addresses and corresponding amounts of USDC tokens to transfer
const senders = wallets.map((wallet) => wallet.address);
const amount = ethers.utils.parseUnits("5000", 18);
const amounts = Array.from({ length: senders.length }, () => amount);
// Add more amounts if needed
// Approve the contract to spend the USDC tokens
async function BatchTransfer() {
  const usdcTokenAddress = "0xA0D71B9877f44C744546D649147E3F1e70a93760"; // Replace with the actual USDC token address
  const usdcAbi = [
    { type: "constructor", stateMutability: "nonpayable", inputs: [] },
    {
      type: "event",
      name: "Approval",
      inputs: [
        {
          type: "address",
          name: "owner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "spender",
          internalType: "address",
          indexed: true,
        },
        {
          type: "uint256",
          name: "value",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OwnershipTransferred",
      inputs: [
        {
          type: "address",
          name: "previousOwner",
          internalType: "address",
          indexed: true,
        },
        {
          type: "address",
          name: "newOwner",
          internalType: "address",
          indexed: true,
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Transfer",
      inputs: [
        {
          type: "address",
          name: "from",
          internalType: "address",
          indexed: true,
        },
        { type: "address", name: "to", internalType: "address", indexed: true },
        {
          type: "uint256",
          name: "value",
          internalType: "uint256",
          indexed: false,
        },
      ],
      anonymous: false,
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "bytes32", name: "", internalType: "bytes32" }],
      name: "DOMAIN_SEPARATOR",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "allowance",
      inputs: [
        { type: "address", name: "owner", internalType: "address" },
        { type: "address", name: "spender", internalType: "address" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "approve",
      inputs: [
        { type: "address", name: "spender", internalType: "address" },
        { type: "uint256", name: "amount", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "balanceOf",
      inputs: [{ type: "address", name: "account", internalType: "address" }],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint8", name: "", internalType: "uint8" }],
      name: "decimals",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "decreaseAllowance",
      inputs: [
        { type: "address", name: "spender", internalType: "address" },
        { type: "uint256", name: "subtractedValue", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "increaseAllowance",
      inputs: [
        { type: "address", name: "spender", internalType: "address" },
        { type: "uint256", name: "addedValue", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "name",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "nonces",
      inputs: [{ type: "address", name: "owner", internalType: "address" }],
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
      stateMutability: "nonpayable",
      outputs: [],
      name: "permit",
      inputs: [
        { type: "address", name: "owner", internalType: "address" },
        { type: "address", name: "spender", internalType: "address" },
        { type: "uint256", name: "value", internalType: "uint256" },
        { type: "uint256", name: "deadline", internalType: "uint256" },
        { type: "uint8", name: "v", internalType: "uint8" },
        { type: "bytes32", name: "r", internalType: "bytes32" },
        { type: "bytes32", name: "s", internalType: "bytes32" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "renounceOwnership",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "string", name: "", internalType: "string" }],
      name: "symbol",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "view",
      outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
      name: "totalSupply",
      inputs: [],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "transfer",
      inputs: [
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "amount", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [{ type: "bool", name: "", internalType: "bool" }],
      name: "transferFrom",
      inputs: [
        { type: "address", name: "from", internalType: "address" },
        { type: "address", name: "to", internalType: "address" },
        { type: "uint256", name: "amount", internalType: "uint256" },
      ],
    },
    {
      type: "function",
      stateMutability: "nonpayable",
      outputs: [],
      name: "transferOwnership",
      inputs: [{ type: "address", name: "newOwner", internalType: "address" }],
    },
  ];

  try {
    // Loop through each sender and approve the contract to spend the tokens
    for (let i = 0; i < senders.length; i++) {
      const usdcTokenContract = new ethers.Contract(
        usdcTokenAddress,
        usdcAbi,
        wallets[i]
      );
      const approvalTx = await usdcTokenContract.approve(
        contractAddress,
        amounts[i]
      );
      await approvalTx.wait();
      console.log(`Approved USDC tokens id:${ids[i]} for sender ${senders[i]}`);
    }
    // Call the receiveUSDC function in the contract
    await sendUSDC();
    // console.log(amounts);
  } catch (error) {
    console.error("Failed to approve USDC tokens:", error);
  }
}

// Call the receiveUSDC function in the contract
async function sendUSDC() {
  try {
    const tx = await contract.receiveUSDC(senders, amounts);
    await tx.wait();
    console.log("USDC tokens sent successfully!");
    const account = [
      {
        tx: tx.hash,
        total: senders.length,
      },
    ];
    const jsonData = JSON.stringify(account, null, 2);
    fs.writeFileSync("result.js", jsonData);
  } catch (error) {
    console.error("Failed to send USDC tokens:", error);
  }
}

// Call the approveTokens function to approve and initiate the token transfer
module.exports = BatchTransfer;
