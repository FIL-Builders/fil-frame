require('dotenv').config();

const contractFactoryAddress = '0x5670BD2621CccC4024238e267C15680d96a6BC01';
const deployerAddress = signer.address;
const deployerBytes = ethers.getBytes(deployerAddress).slice(0, 20);
const randomString = "gmrandomstring"; // This value must change on every deployment
const randomBytes = ethers.toUtf8Bytes(randomString);
const concatenatedBytes = ethers.concat([deployerBytes, randomBytes]);
const salt = ethers.keccak256(concatenatedBytes);

async function deployYourContract() {
    try {
        const ContractFactory = await hre.ethers.getContractAt('YourContractFactory', contractFactoryAddress, signer);
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