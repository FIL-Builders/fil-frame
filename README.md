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
   npm install
   ```

5. Navigate to the hardhat directory:

   ```bash
   cd hardhat
   ```

6. Set up the environment variables to deploy the smart contracts:

   - Create a `.env` file in the hardhat directory.
   - Define the following variables in the `.env` file:
     ```apache
      PRIVATE_KEY=<Your Wallet Private Key>
     ```
     Replace `<Your Wallet Private Key>` with your wallet private key.

7. Compile and Deploy the smart contracts:

   ```bash
   npx hardhat run scripts/deploy.ts --network <network>
   ```

   Replace `<network>` with the desired network (e.g. `calibration` and `sepolia` in this case). Copy the contract address once the deployment is complete.
   
   > Ensure you update the Axelar gateway and gas service address for Filecoin Calibration and Ethereum Sepolia respectively in `deploy.ts` file under the `scripts` directory and deploy them seperately. You  can find the gateway and gas service address [here](https://docs.axelar.dev/resources/testnet).