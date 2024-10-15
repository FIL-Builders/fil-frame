const hre = require('hardhat');
const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Change this to same url as in hardhat.config.ts
const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

async function deployContractFactory() {
    try {
        const ContractFactory = await hre.ethers.getContractFactory('YourContractFactory', signer);
        
        console.log('Deploying YourContractFactory...');
        const factory = await ContractFactory.deploy();
        await factory.waitForDeployment();

        console.log('ContractFactory deployed to:', factory.target);
        return factory.target;
    } catch (err) {
        console.error('Error in deployContractFactory:', err);
    }
}

async function main() {
    await deployContractFactory();
}

main().catch(err => console.error('Error in main function:', err));