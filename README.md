# fil-frame (Storacha)

Kickstart your Filecoin dApp using this open-source development stack. This branch is designed to help you get started with Storacha for uploading files and directories to IPFS.

## Features

- Simple interface to interact with and mint NFTs on Calibration and Filecoin networks.
- Easy setup for uploading files and directories using Storacha.

## Getting Started

1. **Deploy Your NFT Contract:**
   - Follow the instructions in the [Hardhat README](packages/hardhat/README.md) to deploy your NFT contract on the Calibration network.

2. **Set Up Your Application:**
   - Navigate to the [Next.js README](packages/nextjs/README.md) to set up your application for uploading files and directories using Storacha.

3. **Using Storacha Functionalities:**
   - If you only need the functionalities to upload files to Storacha, complete the setup in the [Next.js README](packages/nextjs/README.md).
   - Copy the `app/api` folder from [packages/nextjs/app/api](packages/nextjs/app/api).
   - Include the Storacha hooks from [packages/nextjs/hooks/storacha](packages/nextjs/hooks/storacha).
   - Integrate the frontend code for file inputs from [storachaUpload.tsx](packages/nextjs/app/storacha/_components/storachaUpload.tsx).

## Additional Information

- Ensure you have the necessary dependencies and configurations as outlined in the respective README files.
- For further assistance, refer to the documentation provided in each package directory.