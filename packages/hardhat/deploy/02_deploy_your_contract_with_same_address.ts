import { ethers } from "hardhat";

// Update this with the address of the DeterministicDeployer contract
const DEPLOYED_ADDRESS = "";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Using account:", deployer.address);

    // Get the DeterministicDeployer contract
    const DeterministicDeployer = await ethers.getContractFactory("DeterministicDeployer");
    const deterministicDeployer = DeterministicDeployer.attach(DEPLOYED_ADDRESS);
    const typedDeployer = deterministicDeployer as unknown as {
        computeAddress: (bytecode: string, salt: number) => Promise<string>;
        deploy: (bytecode: string, salt: number) => Promise<string>;
    };

    // Deploy YourContract
    const YourContract = await ethers.getContractFactory("YourContract");
    const bytecode = YourContract.bytecode;
    const salt = 123

    // Compute the address where the contract will be deployed
    const computedAddress = await typedDeployer.computeAddress(bytecode, salt);
    console.log("Computed address:", computedAddress);

    try {
        // Deploy the contract
        console.log("Attempting to deploy the contract...");
        const txHash = await typedDeployer.deploy(bytecode, salt);
        console.log("Transaction hash:", txHash);

        const receipt = await ethers.provider.waitForTransaction(txHash);
        console.log("Transaction receipt:", receipt);

        // Get the deployed address from the receipt
        const deployedAddress = receipt?.contractAddress;
        console.log("Deployed address:", deployedAddress);

        // Verify that the computed and deployed addresses match
        console.assert(computedAddress === deployedAddress, "Addresses don't match!");
    } catch (error: any) {
        console.error("Error deploying contract:");
        console.error(error);
        
        if (error.transaction) {
            console.log("Failed transaction:", error.transaction);
        }
        
        if (error.receipt) {
            console.log("Transaction receipt:", error.receipt);
        }
        
        throw error; // Re-throw the error to maintain the original behavior
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
