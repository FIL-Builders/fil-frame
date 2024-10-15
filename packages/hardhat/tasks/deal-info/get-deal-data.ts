import { DealInfo } from "../../typechain-types/contracts/DealInfo";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Adjust the import path as necessary

task(
  "get-deal-data",
  "Fetches and displays all deal information for a given deal ID"
)
  .addParam("contract", "The address of the DealInfo contract")
  .addParam("dealId", "The ID of the deal to fetch information for")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const contractAddr = taskArgs.contract;
    const dealId = taskArgs.dealId;

    const networkId = hre.network.name;
    console.log(`Fetching deal information on network: ${networkId}`);

    // Get the wallet of the deployer
    const wallet = await hre.ethers.provider.getSigner();
    console.log("Wallet address:", wallet.address);

    // Get the contract instance
    const dealInfo = (await hre.ethers.getContractAt(
      "DealInfo",
      contractAddr,
      wallet
    )) as DealInfo;

    // Fetch the deal information
    const dealData = await dealInfo.getAllDealData(dealId);

    // Log the deal information
    console.log("Deal Information:");
    console.log(`Deal Label: ${dealData.dealLabel}`);
    console.log(`Deal Client Actor ID: ${dealData.dealClientActorId}`);
    console.log(`Deal Provider Actor ID: ${dealData.dealProviderActorId}`);
    console.log(`Deal Commitment: ${dealData.dealCommitment}`);
    console.log(`Deal Term: ${dealData.dealTerm}`);
    console.log(`Deal Price Per Epoch: ${dealData.dealPricePerEpoch}`);
    console.log(`Client Collateral: ${dealData.clientCollateral}`);
    console.log(`Provider Collateral: ${dealData.providerCollateral}`);
    console.log(`Is Deal Activated: ${dealData.isDealActivated}`);
    console.log(`Activation Status: ${dealData.activationStatus}`);
  });

export default {};
