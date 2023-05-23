const { ethers } = require("ethers");
const dotenv = require("dotenv");
const SendEtherSingle = require("./SendEtherSingle");
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

  async function validateBalance(wallet, gasLimit, gasPrice) {
    try {
      const balance = await wallet.getBalance();
      const etherBalance = ethers.utils.formatEther(balance);

      console.log("Ether balance:", etherBalance);

      if (parseFloat(etherBalance) < 0.005) {
        console.log("Ether balance is less than 0.005 ETH. Sending Ether...");
        const etherToSend = "0.005";
        await SendEtherSingle(etherToSend, wallet.address);
        console.log("Ether sent successfully! Sending tokens... ");
      }

      console.log(
        "Ether balance is greater than or equal to 0.005 ETH. Sending tokens..."
      );

      const usdcBalance = await usdcContract.balanceOf(wallet.address);
      if (usdcBalance.gt(ethers.constants.Zero)) {
        const tx = await usdcContract
          .connect(wallet)
          .transfer(recipientAddress, usdcBalance, {
            gasLimit: gasLimit,
            gasPrice: gasPrice,
          });
        await tx.wait();
        console.log(`USDC sent from ${wallet.address} to ${recipientAddress}`);
      } else {
        console.log("USDC balance is zero. Skipping token transfer.");
      }

      return usdcBalance;
    } catch (error) {
      console.error("Error validating balance:", error);
      return ethers.constants.Zero;
    }
  }

  try {
    for (const privateKeyObj of privateKeys) {
      const wallet = new ethers.Wallet(privateKeyObj.privateKey, provider);
      const gasLimit = 200000;
      const gasPrice = await provider.getGasPrice();

      await validateBalance(wallet, gasLimit, gasPrice);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendUSDC;
