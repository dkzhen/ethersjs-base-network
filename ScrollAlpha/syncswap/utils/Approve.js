const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
async function approveTokenTransfer(spenderAddress, amount, privateKey) {
  try {
    // Set up provider and signer
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

    const wallet = new ethers.Wallet(privateKey, provider);

    // Create a contract instance of the ERC20 token
    const contractABI = [
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
          {
            type: "address",
            name: "to",
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
        inputs: [
          { type: "address", name: "newOwner", internalType: "address" },
        ],
      },
    ];
    const tokenAddress = "0xA0D71B9877f44C744546D649147E3F1e70a93760";
    const tokenContract = new ethers.Contract(
      tokenAddress,
      contractABI,
      wallet
    );

    // Approve the token transfer
    const transaction = await tokenContract.approve(spenderAddress, amount);
    await transaction.wait();

    console.log("Token transfer approved successfully.");
  } catch (error) {
    console.error(error);
  }
}

// Usage example

const spenderAddress = "SPENDER_ADDRESS";
const amount = ethers.utils.parseUnits("100", 18); // Amount in token's smallest unit (e.g., wei)

module.exports = approveTokenTransfer;
