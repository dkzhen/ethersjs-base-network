const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const config = require("./config");

async function generateAccounts(numAccounts) {
  const accounts = [];

  for (let i = 0; i < numAccounts; i++) {
    const wallet = ethers.Wallet.createRandom();
    const account = {
      id: i + 1, // Add ID to the account
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
    accounts.push(account);
  }

  return accounts;
}

async function generateAndSaveAccounts(numAccounts, fileName) {
  let targetFileName = fileName;
  let counter = 1;

  while (fs.existsSync(targetFileName)) {
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const randomChar = generateRandomString(counter);
    targetFileName = `${baseName}${randomChar}${extension}`;
    counter++;
  }
  function generateRandomString(length) {
    let result = "";
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  const accounts = await generateAccounts(numAccounts);

  const jsonData = JSON.stringify(accounts, null, 2);

  fs.writeFileSync(targetFileName, jsonData);

  console.log(
    `Generated ${numAccounts} accounts and saved them to ${fileName}.`
  );
}

const numAccounts = config.numAccounts; // Specify the number of accounts to generate
const fileName = config.nameFile; // Specify the file name for the JSON file

generateAndSaveAccounts(numAccounts, fileName);
