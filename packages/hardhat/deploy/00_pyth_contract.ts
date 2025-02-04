import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploys a contract named "PythContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployPythContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const [deployerSigner] = await hre.ethers.getSigners();
  const deployer = await deployerSigner.getAddress();

  const { deploy } = hre.deployments;

  const PythContract = await deploy("PythContract", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  console.log("🚀 PythContract deployed at: ", PythContract.address);
  const PythContractAddress = PythContract.address;

  // Check if the --verify flag is present
  const shouldVerify = process.env.VERIFY === "true";

  if (shouldVerify) {
    console.log("🕵️‍♂️ Verifying the contract on the explorer...");

    const filecoinNetworks = ["calibration", "filecoin"];
    if (filecoinNetworks.includes(hre.network.name)) {
      // Verify the contract on the filfox explorer
      await hre.run("verify-contract", {
        contractName: "PythContract",
      });
    } else {
      await hre.run("verify:verify", {
        address: PythContractAddress,
        constructorArguments: [deployer],
      });
    }
  }
};

export default deployPythContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags PythContract
deployPythContract.tags = ["PythContract"];
