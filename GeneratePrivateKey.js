const { ethers } = require("ethers");
const fs = require("fs");

async function generateAccounts(numAccounts) {
  const accounts = [];

  for (let i = 0; i < numAccounts; i++) {
    const wallet = ethers.Wallet.createRandom();
    const account = {
      id: i + 1, // Add ID to the account
      address: wallet.address,
      privateKey: wallet.privateKey,
      numClaims: 20,
    };
    accounts.push(account);
  }

  return accounts;
}

async function generateAndSaveAccounts(numAccounts, fileName) {
  const accounts = await generateAccounts(numAccounts);

  const jsonData = JSON.stringify(accounts, null, 2);

  fs.writeFileSync(fileName, jsonData);

  console.log(
    `Generated ${numAccounts} accounts and saved them to ${fileName}.`
  );
}

const numAccounts = 10; // Specify the number of accounts to generate
const fileName = "config.json"; // Specify the file name for the JSON file

generateAndSaveAccounts(numAccounts, fileName);
