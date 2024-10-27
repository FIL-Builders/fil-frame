async function main() {
  const SendMessage = await hre.ethers.getContractFactory("SendMessage");
  const sendMessage = await SendMessage.deploy(
    // 1. Uncomment to deploy on Filecoin Calibration
    // "0x999117D44220F33e0441fbAb2A5aDB8FF485c54D",
    // "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"

    // 2. Uncomment to deploy on Ethereum Sepolia
    // "0xe432150cce91c13a887f7D836923d5597adD8E31",
    // "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
  );

  await sendMessage.deployed();

  console.log(`SendMessage contract deployed to ${sendMessage.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
