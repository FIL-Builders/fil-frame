import {
  DealRequestStruct,
  ExtraParamsV1Struct,
} from "../../typechain-types/contracts/DealClient";
import CID from "cids";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Adjust the import path as necessary

task(
  "make-deal-proposal",
  "Makes a deal proposal via the client contract. This will ultimately emit an event that storage providers can listen to and choose to accept your deal."
)
  .addParam("contract", "The address of the deal client solidity")
  .addParam("pieceCid", "The address of the DealRewarder contract")
  .addParam(
    "pieceSize",
    "The piece CID of the data you want to put up a bounty for"
  )
  .addParam("verifiedDeal", "Size of the data you are putting a bounty on")
  .addParam("label", "The deal label (typically the raw cid)")
  .addParam("startEpoch", "The epoch the deal will start")
  .addParam("endEpoch", "The epoch the deal will end")
  .addParam("storagePricePerEpoch", "The cost of the deal, in FIL, per epoch")
  .addParam(
    "providerCollateral",
    "The collateral, in FIL, to be put up by the storage provider"
  )
  .addParam(
    "clientCollateral",
    "The collateral, in FIL, to be put up by the client (which is you)"
  )
  .addParam("extraParamsVersion", "")
  .addParam("locationRef", "Where the data you want to be stored is located")
  .addParam("carSize", "The size of the .car file")
  .addParam("skipIpniAnnounce", "")
  .addParam("removeUnsealedCopy", "")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    // Store taskArgs as usable variables
    // Convert piece CID string to hex bytes
    const cid = taskArgs.pieceCid;
    const cidHexRaw = new CID(cid).toString("base16").substring(1);
    const cidHex = "0x" + cidHexRaw;
    const contractAddr = taskArgs.contract;

    const verified = taskArgs.verifiedDeal === "true";
    const skipIpniAnnounce = taskArgs.skipIpniAnnounce === "true";
    const removeUnsealedCopy = taskArgs.removeUnsealedCopy === "true";

    const extraParamsV1: ExtraParamsV1Struct = {
      location_ref: taskArgs.locationRef,
      car_size: taskArgs.carSize,
      skip_ipni_announce: skipIpniAnnounce,
      remove_unsealed_copy: removeUnsealedCopy,
    };

    const dealRequestStruct: DealRequestStruct = {
      piece_cid: cidHex,
      piece_size: taskArgs.pieceSize,
      verified_deal: verified,
      label: taskArgs.label,
      start_epoch: taskArgs.startEpoch,
      end_epoch: taskArgs.endEpoch,
      storage_price_per_epoch: taskArgs.storagePricePerEpoch,
      provider_collateral: taskArgs.providerCollateral,
      client_collateral: taskArgs.clientCollateral,
      extra_params_version: taskArgs.extraParamsVersion,
      extra_params: extraParamsV1,
    };

    const networkId = hre.network.name;
    console.log("Making deal proposal on network", networkId);

    // Get the wallet of the deployer
    const wallet = await hre.ethers.provider.getSigner();
    console.log("Wallet address:", wallet.address);

    // Get the contract instance
    const dealClient = await hre.ethers.getContractAt(
      "DealClient",
      contractAddr
    );

    // Send a transaction to call makeDealProposal() method
    const transaction = await dealClient.makeDealProposal(dealRequestStruct);
    const transactionReceipt = await transaction.wait();

    // Listen for DealProposalCreate event
    if (transactionReceipt) {
      const event = transactionReceipt.logs[0].topics[1];
      console.log("Complete! Event Emitted. ProposalId is:", event);
    } else {
      console.error("Transaction receipt or events are null");
    }
  });
