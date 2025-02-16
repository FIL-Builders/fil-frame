import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTokenContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("***** Start Deloying Contracts *****");
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  console.log("Deploying with account:", deployer);

  const NickleToken = await deploy("Nickle", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 2,
  });

  console.log("🚀 Nickle Contract Deployed at: ", NickleToken.address);
};

export default deployTokenContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags OnRampSource
deployTokenContract.tags = ["Nickle"];
