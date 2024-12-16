"use client";

import { useEffect } from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useWalletClient, useWriteContract } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { writeContract, data: hash, isError, error } = useWriteContract();

  const handleUpdateAndMint = async () => {
    try {
      if (!walletClient || !connectedAddress) {
        console.error("Wallet not connected");
        return;
      }

      const connection = new EvmPriceServiceConnection("https://hermes.pyth.network");
      const priceIds = ["0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e"];
      const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
      console.log("Retrieved Pyth price update:", priceFeedUpdateData);

      const response = await fetch(
        "https://hermes.pyth.network/v2/updates/price/latest?ids[]=0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e",
      );
      const data = await response.json();
      console.log("Pyth Price Data:", data.parsed[0].price.price * 10 ** data.parsed[0].price.expo);
      console.log("Submitting transaction...");

      const oneDollarInFil = 1 / (data.parsed[0].price.price * 10 ** data.parsed[0].price.expo);

      // If we do exactly one dollar, we may get an insufficient fee error
      const price = String(oneDollarInFil + oneDollarInFil * 0.01);

      await writeContract({
        address: deployedContracts[11155111].PythContract.address,
        abi: deployedContracts[11155111].PythContract.abi,
        functionName: "updateAndMint",
        args: [priceFeedUpdateData as any],
        value: parseEther(price),
      });
    } catch (error) {
      console.error("Error in handleUpdateAndMint:", error);
    }
  };

  useEffect(() => {
    if (isError) {
      console.error("Transaction failed:", error);
    }
    if (hash) {
      console.log("Transaction submitted! Hash:", hash);
      const etherscanUrl = `https://sepolia.etherscan.io/tx/${hash}`;
      console.log("View on Etherscan:", etherscanUrl);
    }
  }, [isError, error, hash]);

  return (
    <>
      <div>
        <h1>Pyth</h1>
        <button
          onClick={handleUpdateAndMint}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Mint
        </button>
      </div>
    </>
  );
};

export default Home;
