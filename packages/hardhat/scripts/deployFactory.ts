require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

async function deployContractFactory() {
    try {
        const ContractFactory = await hre.ethers.getContractFactory('ContractFactory', signer);
        
        console.log('Deploying ContractFactory...');
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