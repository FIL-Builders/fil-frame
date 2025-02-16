import * as dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
  const proverAddressFilecoin = process.env.PROVER_CONTRACT_ADDRESS_DEST_CHAIN;
  const oracleAddressLinea = process.env.ORACLE_CONTRACT_ADDRESS_SRC_CHAIN;
  const onrampAddressLinea = process.env.ONRAMP_CONTRACT_ADDRESS_SRC_CHAIN;

  console.log("***** Start wiring Contracts on Source Chain *****");

  //Wiring Prover Contract on Filecon to Onramp & Oracle contracts on Source Chain
  const onrampContract = await ethers.getContractAt("OnRampContract", onrampAddressLinea);
  const setOnrampTx = await onrampContract.setOracle(oracleAddressLinea);
  console.log("~*~*~ Connect Oracle to onrampContract at:", setOnrampTx.hash);
  await setOnrampTx.wait();

  const oracleContract = await ethers.getContractAt("AxelarBridge", oracleAddressLinea);
  const setOracleTx = await oracleContract.setSenderReceiver(proverAddressFilecoin, onrampAddressLinea);
  console.log("~*~*~ Setting sender & receiver to oracleContract at:", setOracleTx.hash);
  await setOracleTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
