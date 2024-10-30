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

   Run `yarn start` in the root directory and open up localhost:3000. Input a message, click send, and confirm the transaction in your wallet. After a couple of minutes, check [Axelarscan](https://testnet.axelarscan.io/gmp/search) - you should see a transaction from Filecoin Calibration to Ethereum Sepolia.

9. Read the message received on the destination chain:

    Once the txn status is Executed on Axelarscan, click refresh. You should see the message you sent appear on the destination chain!