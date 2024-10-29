# fil-frame
Quickstart your Filecoin dApp using this open source dev stack.

# Getting Started

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

5. Navigate to the hardhat directory:

   ```bash
   cd packages/hardhat
   ```

6. Set up the environment variables to deploy the smart contracts:

   - Create a `.env` file in the hardhat directory.
   - Define the following variables in the `.env` file:
     ```apache
      PRIVATE_KEY=<Your Wallet Private Key>
     ```
     Replace `<Your Wallet Private Key>` with your wallet private key.

7. Update `deploy.ts` under the `scripts` directory:

   Uncomment the network you want to deploy to in the `SendMessage.deploy` function. You can find other gateway and gas service addresses [here](https://docs.axelar.dev/resources/testnet).

8. Compile and deploy the smart contracts:

   ```bash
   npx hardhat run scripts/deploy.ts --network <network>
   ```

   Replace `<network>` with the desired network (e.g. `calibration` and `sepolia` in this case). Make sure you have enough tFIL and Sepolia ETH in your wallet! Copy the contract address once the deployment is complete.

9. Paste the 2 contract addresses into `packages/nextjs/app/axelar/page.tsx`:

10. Send a message to the destination chain:

   Run `yarn start` in the root directory and open up localhost:3000. Input a message, click send, and confirm the transaction in your wallet. After a couple of minutes, check [Axelarscan](https://testnet.axelarscan.io/gmp/search) - you should see a transaction from Filecoin Calibration to Ethereum Sepolia.

11. Read the message received on the destination chain:

    Once the txn status is Executed on Axelarscan, click refresh. You should see the message you sent appear on the destination chain!