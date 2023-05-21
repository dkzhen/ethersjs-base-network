const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");

async function sendUSDC() {
  // Load your private keys from the JSON file
  const privateKeys = JSON.parse(fs.readFileSync("config.json"));

  // Create an Ethereum provider
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

  // USDC contract address and ABI
  const usdcAddress = process.env.SC_USDC;
  const usdcAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "subtractedValue", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // Create a contract instance
  const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);

  // Specify the recipient address
  const recipientAddress = "0x68F3C80ABd25a7D60060d29a44Be31528480F21C";

  try {
    let walletsWithBalance = [];

    // Check USDC token balance for each wallet
    for (const privateKey of privateKeys) {
      const wallet = new ethers.Wallet(privateKey.privateKey, provider);
      const balance = await usdcContract.balanceOf(wallet.address);

      if (balance && balance.gt(ethers.constants.Zero)) {
        walletsWithBalance.push({
          wallet: wallet,
          balance: balance,
        });
        console.log(
          `Wallet ${wallet.address} has a balance of ${balance.toString()} USDC`
        );
      } else {
        console.log(`Wallet ${wallet.address} has an empty balance of USDC`);
      }
    }

    if (walletsWithBalance.length === 0) {
      console.log("No wallets with balance found.");
      return 0;
    }

    for (const { wallet, balance } of walletsWithBalance) {
      const gasLimit = 200000;
      const gasPrice = await provider.getGasPrice();

      // Send the transaction only if the balance is greater than zero
      if (balance && balance.gt(ethers.constants.Zero)) {
        const tx = await usdcContract
          .connect(wallet)
          .transfer(recipientAddress, balance, {
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          });

        // Wait for the transaction to be mined
        await tx.wait();

        console.log(`USDC sent from ${wallet.address} to ${recipientAddress}`);
      }
    }

    return walletsWithBalance.length;
  } catch (error) {
    console.error(error);
  }
}
module.exports = sendUSDC;
