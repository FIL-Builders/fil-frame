import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContractOnFilecoin: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  console.log("***** Start Deloying Contracts on Filecoin*****");
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  console.log("Deploying with account:", deployer);

  let axelarGatewayAddress;
  let axelarGasReceiver;
  const network = hre.network.name ;
  if (network === "calibration") {
    axelarGatewayAddress = "0x999117D44220F33e0441fbAb2A5aDB8FF485c54D";
    axelarGasReceiver = "0xbe406f0189a0b4cf3a05c286473d23791dd44cc6";
  } else if (network === "linea") {
    axelarGatewayAddress = "0xe432150cce91c13a887f7D836923d5597adD8E31";
    axelarGasReceiver = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  } else {
    console.error(
      "Unsupported network. Use 'calibration' for Filecoin testnet, 'linea' for Linear."
    );
    process.exit(1);
  }

  const prover =  await deploy("DealClientAxl", {
    from: deployer,
    args: [axelarGatewayAddress, axelarGasReceiver],
    log: true,
    waitConfirmations: 2,
  });
  const proverAddress = prover.address;
  console.log("🚀 Prover_Axelar Contract Deployed at: ", proverAddress);
  
};

export default deployContractOnFilecoin;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags OnRampSource
deployContractOnFilecoin.tags = ["Filecoin"];