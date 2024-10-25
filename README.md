# fil-frame (Lighthouse)

Kickstart your Filecoin dApp using this open-source development stack. This branch is designed to help you get started with Lighthouse for

- uploading files and directories to IPFS.
- uploading encrypted files and directories to IPFS.
- Interact with the LighthouseNFT to see the usage of these features

## Features

- Simple interface to interact with and mint NFTs on Calibration and Filecoin networks.
- Easy setup for uploading files and directories using Lighthouse.

## Getting Started

1. **Deploy Your NFT Contract:**

   - Follow the instructions in the [Hardhat README](packages/hardhat/README.md) to deploy your NFT contract on the Calibration network.

2. **Set Up Your Application:**

   - Navigate to the [Next.js README](packages/nextjs/README.md) to set up your application for uploading files and directories using Lighthouse.

3. **Using Lighthouse Functionalities:**
   If you only need the functionalities to upload files to Lighthouse then :
   - Include the Lightohuse hooks from [packages/nextjs/hooks/lighthouse](packages/nextjs/hooks/lighthouse).
   - Integrate the frontend code for file inputs from [lighthouseUpload.tsx](packages/nextjs/app/lighthouse/_components/lighthouseUpload.tsx).
