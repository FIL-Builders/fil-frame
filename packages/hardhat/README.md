# Sample Hardhat Project

This project demonstrates a basic use case of Hardhat for deploying an NFT contract. You can interact with the contract on the frontend and mint NFTs, with their files stored on the Lighthouse network.

## Prerequisites

1. **Private Key**: Ensure you have your private key ready.
2. **Test FIL**: Visit the [Calibration Net faucet](https://faucet.triangleplatform.com/filecoin/calibration) to receive some test FIL.

## Setup

1. **Environment Variables**: Add your private key to the `.env` file.

   ```shell
   cp .env.example .env
   ```

   ```plaintext
   PRIVATE_KEY=your_private_key_here
   ```

2. **Deployment**: Execute the following command to deploy and verify your contracts on the Calibration Net. This will also verify your contracts on Filfox.

- ```shell
  yarn install
  ```

- ```shell
  yarn compile
  ```

- ```shell
  yarn deploy
  ```

## Next Steps

After deploying your contracts, proceed to the Next.js app [README](../nextjs/README.md) and follow the instructions to set up the application and check Lighthouse abilities then copy the code and integrate into your amazing application.

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Lighthouse Network Docs](https://docs.lighthouse.storage/lighthouse-1/quick-start)
