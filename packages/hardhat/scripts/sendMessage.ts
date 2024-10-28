import { ethers } from "ethers";
import { abi } from '../artifacts/contracts/SendMessage.sol/SendMessage.json'

async function main() {
    try {
        // Validate environment variables
        if (!process.env.DEPLOYER_PRIVATE_KEY) {
            throw new Error("Missing required environment variables");
        }

        const provider = ethers.getDefaultProvider("https://rpc.ankr.com/filecoin_testnet");
        const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

        // Create contract instance
        const contractAddress = "0xfF70C3ae45022AE728b62c90d0c14D526560e9Cf";
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        console.log("Sending message...");
        const transaction = await contract.sendMessage(
            "ethereum-sepolia",
            "0xE714E764886047B55c41A9E7c4233f09347f01ad",
            "This is a test message!!",
            { value: ethers.parseEther("1") }
        );

        console.log("Transaction sent, waiting for confirmation...");
        await transaction.wait();
        console.log("Transaction successful!");
        console.log("Transaction hash:", transaction.hash);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error details:", error.message);
        } else {
            console.error("An unknown error occurred:", error);
        }
        throw error; // Re-throw to trigger the process.exitCode = 1
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
