import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying DeterministicDeployer with account:", deployer.address);

  const DeterministicDeployer = await ethers.getContractFactory("DeterministicDeployer");
  const deterministicDeployer = await DeterministicDeployer.deploy();

  await deterministicDeployer.waitForDeployment();

  console.log("DeterministicDeployer deployed to:", deterministicDeployer.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });