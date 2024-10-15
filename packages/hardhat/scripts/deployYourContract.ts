const hre = require('hardhat');
const { ethers } = require('ethers');
require('dotenv').config();

const providerr = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signerr = new ethers.Wallet(process.env.PRIVATE_KEY, providerr)

const contractFactoryAddress = '0x51CfFEd3D9561751c3D81cC6A03d55a89cCc2138';
const deployerAddress = signerr.address;
const deployerBytes = ethers.getBytes(deployerAddress).slice(0, 20);
const randomString = "randomstring"; // This value must change on every deployment
const randomBytes = ethers.toUtf8Bytes(randomString);
const concatenatedBytes = ethers.concat([deployerBytes, randomBytes]);

// Generating the salt by hashing the concatenated bytes
const salt = ethers.keccak256(concatenatedBytes);

async function deployYourContract() {
    try {
        const ContractFactory = await hre.ethers.getContractAt('ContractFactory', contractFactoryAddress, signerr);
        // Compute expected address before deployment
        const expectedAddress = await ContractFactory.computeTokenAddress(salt);
        console.log('Expected YourContract address:', expectedAddress);

        // Deploying YourContract using ContractFactory
        const txn = await ContractFactory.deployContract(salt);
        await txn.wait()
        const tokenAddress = await ContractFactory.latestTokenAddress()
        console.log('Deployed YourContract address:', tokenAddress);
        if (expectedAddress == tokenAddress) {
            console.log("Expected and deployed address match, CREATE2 functionality verified!");
        } else {
            console.error("Mismatch in expected and deployed addresses!");
        }

    } catch (err) {
        console.error('Error in deployYourContract:', err);
    }
}

async function mainfxn() {
    await deployYourContract();
}

mainfxn().catch(err => console.error('Error in main function:', err));