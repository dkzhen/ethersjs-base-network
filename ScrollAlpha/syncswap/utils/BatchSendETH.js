const { ethers } = require("ethers");
const dotenv = require("dotenv");
const fs = require("fs");
const config = require("../../../config");
dotenv.config();
// Set up provider with your Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);

// Set up the contract interface
const jsonData = fs.readFileSync(config.nameFile);
const addresses = JSON.parse(jsonData);
const addressTuyul = addresses.map((obj) => obj.address);
const contractAddress = "0xD51379C195952065cd67C7B9b983859127E2272a";
const privateKey = process.env.PRIVATE_KEY;
const contractABI = [
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address payable" }],
    name: "batchAddresses",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "getContractBalance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "payable",
    outputs: [],
    name: "sendFee",
    inputs: [
      {
        type: "address[]",
        name: "_batchAddresses",
        internalType: "address payable[]",
      },
      { type: "uint256", name: "feeAmount", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "withdraw",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }],
  },
];
async function transferFee() {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const amountETHPerBatch = ethers.utils.parseEther(config.numETHFee); // Fee amount in ETH
    const overrides = {
      value: amountETHPerBatch.mul(addressTuyul.length),
    };

    const transaction = await contract.sendFee(
      addressTuyul,
      amountETHPerBatch,
      overrides
    );
    await transaction.wait();

    console.log(
      `Fee sent successfully. https://blockscout.scroll.io/tx/${transaction.hash}`
    );
  } catch (error) {
    console.error(error);
  }
}

// Call the claimAllTokens function
module.exports = transferFee;
