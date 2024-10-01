import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const filecoinNetwork = hre.network.name === "calibnet";
  const linearNetwork = hre.network.name === "linea";
  const hederaNetwork = hre.network.name === "hedera";
  const flowNetwork = hre.network.name === "flow";

  let axelarGatewayAddress;
  let axelarGasReceiver;

  if (hederaNetwork) {
    axelarGatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
    axelarGasReceiver = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  } else if (linearNetwork) {
    axelarGatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
    axelarGasReceiver = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  } else if (flowNetwork) {
    axelarGatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
    axelarGasReceiver = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  } else if (filecoinNetwork) {
    axelarGatewayAddress = "0x999117D44220F33e0441fbAb2A5aDB8FF485c54D";
    axelarGasReceiver = "0xbe406f0189a0b4cf3a05c286473d23791dd44cc6";
  } else {
    console.error(
      "Unsupported network. Use 'calibnet' for Filecoin, 'linea' for Linear, 'hedera' for Hedera, or 'flow' for Flow."
    );
    process.exit(1);
  }

  await deploy("OnRampSource", {
    from: deployer,
    // Contract constructor arguments
    args: [axelarGatewayAddress, axelarGasReceiver],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const onRampSource = await hre.ethers.getContract<Contract>(
    "OnRampSource",
    deployer
  );
  console.log("👋 Deployed OnRampSource:", onRampSource);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags OnRampSource
deployYourContract.tags = ["OnRampSource"];
