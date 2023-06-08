const express = require("express");
const axios = require("axios");
const config = require("./config");
const app = express();
const BatchSendETH = require("./ScrollAlpha/frontend/BatchSendETH");
const claimAllTokens = require("./ScrollAlpha/frontend/ClaimUSDC");
const BatchTransfer = require("./ScrollAlpha/frontend/BatchTransfer");
const generateAndSaveAccounts = require("./ScrollAlpha/frontend/GeneratePrivateKey");
const fs = require("fs");
const path = require("path");
const port = 100;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submitv1", async (req, res) => {
  const nameFile = req.body.nameFile;
  const numAccounts = req.body.numAccounts;
  let targetFileName = nameFile;
  let counter = 1;

  while (fs.existsSync(targetFileName)) {
    const extension = path.extname(nameFile);
    const baseName = path.basename(nameFile, extension);
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase character
    const randomChar1 = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    ); // Random lowercase character
    const randomChar2 = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    ); // Random lowercase character
    targetFileName = `${baseName}${randomChar}${randomChar2}${randomChar1}${randomChar}${randomChar2}${randomChar1}${randomChar}${randomChar2}${randomChar1}${extension}`;
    counter++;
  }

  await FaucetV1(targetFileName, numAccounts);

  res.redirect("/");
});
app.post("/submitv2", async (req, res) => {
  const nameFile = req.body.nameFile;
  const numAccounts = req.body.numAccounts;
  let targetFileName = nameFile;
  let counter = 1;

  while (fs.existsSync(targetFileName)) {
    const extension = path.extname(nameFile);
    const baseName = path.basename(nameFile, extension);
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase character
    const randomChar1 = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    ); // Random lowercase character
    const randomChar2 = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    ); // Random lowercase character
    targetFileName = `${baseName}${randomChar}${randomChar2}${randomChar1}${randomChar}${randomChar2}${randomChar1}${randomChar}${randomChar2}${randomChar1}${extension}`;
    counter++;
  }
  await FaucetV2(targetFileName, numAccounts);

  res.redirect("/");
});
const webhookUrl =
  "https://discord.com/api/webhooks/1110934381872300103/uONGg3CK-bpRrr_WK4GOX75CsLtqQv7jzfG2N4x5BXYD--w4_UY3UgqJY3AC0vQGyxqP";

async function FaucetV1(input) {
  console.log("Received input:", input);
  config.nameFile = input;
  console.log("Received config:", config);
  await generateAndSaveAccounts(config.numAccounts, config.nameFile);
  delay(30000);
  await BatchSendETH(config.nameFile, config.numETHFee); //
  delay(25000);
  await claimAllTokens(config.nameFile);
  await BatchTransfer(config.nameFile);
  const message = `Bot successfully claimed! message from screen ${config.nameFile} Hash: Not Found :)`;
  await discord(message);
  // Do something with the input
}
async function FaucetV2(input) {
  console.log("Received input:", input);
  config.nameFile = input;
  console.log("Received config:", config);
  await generateAndSaveAccounts(config.numAccounts, config.nameFile);
  delay(30000);
  await BatchSendETH(config.nameFile, config.numETHFee); //
  delay(25000);
  await claimAllTokens(config.nameFile);
  await BatchTransfer(config.nameFile);
  const message = `Bot successfully claimed! message from screen ${config.nameFile} Hash: Not Found :)`;
  await discord(message);
  // Do something with the input
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function discord(message) {
  try {
    await axios.post(webhookUrl, { content: message });
    console.log("Discord alert sent successfully");
  } catch (error) {
    console.error("Error sending Discord alert:", error);
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
