# FIL-Frame  🚀
# This is a test to make sure CI/CD is working

Tutorial video: https://youtu.be/dzg7ygwAp1Q

Axelarscan (testnet): https://testnet.axelarscan.io/gmp/search?sourceChain=filecoin-2

Filecoin Calibration faucet: https://faucet.calibnet.chainsafe-fil.io/

Welcome to FIL-Frame, a starter repository designed to help developers quickly get started with building decentralized applications (dApps) on the Filecoin network. This repository provides various integration options, including an example template using Lighthouse.

## Table of Contents 📚

- Overview
- Getting Started
  - Prerequisites
  - Installation
  - Configuration
- Usage
  - Deploying smart contracts
  - Running the frontend
- Storage Onramp Options
  - Lighthouse
  - Storacha
- Project Structure
- Contribution guidelines
- License

## Overview 🌐

FIL-Frame is a monorepo that includes two main packages:

`hardhat`: Manages the blockchain-related aspects, including smart contract development, deployment, and testing.

`nextjs`: Handles the frontend and API aspects of the project using Next.js.

This repository is designed to be a quickstart for developers new to the Filecoin ecosystem, providing various integration options to suit different needs.

## Getting Started 🚀

### Prerequisites 📋

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/package-manager) (v20.9.0)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation)

### Installation 💻

### From source code

1. Clone the repository:

   ```bash
   git clone https://github.com/FIL-Builders/fil-frame.git
   ```

2. Navigate to project directory:

   ```bash
   cd fil-frame
   ```

3. Switch to `axelar-integration` branch

   ```bash
   git checkout axelar-integration
   ```

4. Install the dependencies:

   ```bash
   yarn install
   ```

5. Set up the environment variables to deploy the smart contracts:

   - Create a `.env` file in the `packages/hardhat` directory.
   - Define the following variables in the `.env` file:
     ```apache
      PRIVATE_KEY=<Your Wallet Private Key>
     ```
     Replace `<Your Wallet Private Key>` with your wallet private key.

6. Update `00_deploy_your_contract.ts` under the `deploy` directory:

   Uncomment the network you want to deploy to (lines 31 - 37). You can find other gateway and gas service addresses [here](https://docs.axelar.dev/resources/testnet).

7. Deploy the smart contracts:

   ```bash
   yarn deploy --network <network>
   ```

   Replace `<network>` with the desired network (e.g. `calibration` and `sepolia` in this case). Make sure you have enough tFIL and Sepolia ETH in your wallet!

8. Send a message to the destination chain:

   Run `yarn start` in the root directory and open up localhost:3000. Input a message, click send, and confirm the transaction in your wallet. After 20 minutes, check [Axelarscan](https://testnet.axelarscan.io/gmp/search) - you should see a transaction from Filecoin Calibration to Ethereum Sepolia confirmed.

9. Read the message received on the destination chain:

    Once the txn status is Executed on Axelarscan, click refresh. You should see the message you sent appear on the destination chain!