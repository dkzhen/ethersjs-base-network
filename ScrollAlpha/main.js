const FaucetV1 = require("./syncswap/FaucetV1");

async function main() {
  try {
    await FaucetV1();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
