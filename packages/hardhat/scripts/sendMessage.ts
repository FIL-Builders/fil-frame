import { ethers } from "ethers";
import { abi } from '../artifacts/contracts/SendMessage.sol/SendMessage.json'

async function main() {
    try {
        if (!process.env.DEPLOYER_PRIVATE_KEY) {
            throw new Error("Missing required environment variables");
        }

        const provider = ethers.getDefaultProvider("https://rpc.ankr.com/filecoin_testnet");
        const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

        const contractAddress = "INSERT_ADDRESS"; // TO DO: Update to Filecoin Calibration Contract Address
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        console.log("Sending message...");
        const transaction = await contract.sendMessage(
            "ethereum-sepolia",
            "INSERT_ADDRESS", // TO DO: Update to Ethereum Sepolia Contract Address
            "This is a test message!!", // Change this to the message you want to send
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
        throw error;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
