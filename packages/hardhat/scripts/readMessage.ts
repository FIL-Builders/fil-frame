import { ethers } from "ethers";
import { abi } from '../artifacts/contracts/SendMessage.sol/SendMessage.json'

async function main() {
    try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
        const contract = new ethers.Contract(
          "0xE714E764886047B55c41A9E7c4233f09347f01ad",
          abi,
          provider
        );
        const value = await contract.value();
        console.log("Value:", value);
        const sourceChain = await contract.sourceChain();
        console.log("Source chain: ", sourceChain);
      } catch (error) {
        console.log(error);
      }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});