const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying FundTracker contract...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📝 Deploying with account: ${deployer.address}`);

  // Deploy the contract
  const FundTracker = await hre.ethers.getContractFactory(
    "contracts/FundTrackerSecure.sol:FundTracker"
  );
  const fundTracker = await FundTracker.deploy();

  await fundTracker.waitForDeployment();
  const deployedAddress = await fundTracker.getAddress();

  console.log(`✅ FundTracker deployed to: ${deployedAddress}`);
  console.log("\n📋 Next steps:");
  console.log(`1. Update .env file with: VITE_CONTRACT_ADDRESS=${deployedAddress}`);
  console.log(
    "2. Verify contract on Etherscan (if needed)"
  );
  console.log(
    "3. Grant government official roles to addresses that should create projects"
  );

  // Save contract info
  const fs = require("fs");
  const deploymentInfo = {
    contract: "FundTracker",
    address: deployedAddress,
    deployer: deployer.address,
    network: (await hre.ethers.provider.getNetwork()).name,
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deploymentSecure.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deploymentSecure.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
