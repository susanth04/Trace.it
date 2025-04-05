const hre = require("hardhat");

async function main() {
  const fundTracker = await hre.ethers.deployContract("FundTracker");
  await fundTracker.waitForDeployment();
  console.log(`FundTracker deployed to ${await fundTracker.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
