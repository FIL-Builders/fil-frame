import * as dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const proverAddressFilecoin = process.env.PROVER_CONTRACT_ADDRESS_DEST_CHAIN;
  const oracleAddressLinea = process.env.ORACLE_CONTRACT_ADDRESS_SRC_CHAIN;

  console.log("***** Start wiring Oracle Contract on Filecoin *****");
  // Get the deployed contract instance by name
  const proverContract = await ethers.getContractAt("DealClientAxl", proverAddressFilecoin);
  const setProverTx = await proverContract.setDestinationChains([59141], ["linea"], [oracleAddressLinea]);

  // Wait for the transaction to be mined
  console.log("~*~*~ Connect Oracle to ProverContract at:", setProverTx.hash);
  await setProverTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
