"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import deployedContracts from "../../contracts/deployedContracts";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useWalletClient, useWriteContract } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const FIL_PRICE_FEED_ID = "0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e";
const PYTH_FIL_USD_ENDPOINT = `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${FIL_PRICE_FEED_ID}`;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [price, setPrice] = useState(0);
  const { writeContract, data: hash, isError, error } = useWriteContract();

  const fetchFilPrice = async () => {
    try {
      const response = await fetch(PYTH_FIL_USD_ENDPOINT);
      const data = await response.json();
      const oneDollarInFil = 1 / (data.parsed[0].price.price * 10 ** data.parsed[0].price.expo);
      const actualPrice = oneDollarInFil + oneDollarInFil * 0.01;
      setPrice(Number(actualPrice.toFixed(4)));
      console.log("Pyth Price Data:", data.parsed[0].price);
    } catch (error) {
      console.error("Error fetching Pyth data:", error);
    }
  };

  useEffect(() => {
    fetchFilPrice();
  }, []);

  const handleUpdateAndMint = async () => {
    try {
      if (!walletClient || !connectedAddress) {
        console.error("Wallet not connected");
        return;
      }

      const connection = new EvmPriceServiceConnection("https://hermes.pyth.network");
      const priceIds = [FIL_PRICE_FEED_ID];
      const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
      console.log("Retrieved Pyth price update:", priceFeedUpdateData);

      const response = await fetch(PYTH_FIL_USD_ENDPOINT);
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
      const etherscanUrl = `https://calibration.filscan.io/en/message/${hash}/`;
      console.log("View on Filscan:", etherscanUrl);
    }
  }, [isError, error, hash]);

  return (
    <div className="flex justify-center min-h-screen bg-base-200">
      <div className="card w-96 mt-10 bg-white shadow-xl" style={{ height: "560px" }}>
        <figure className="px-10 pt-10">
          <Image
            src="/fil-b-nft.png"
            alt="FIL-B NFT"
            className="rounded-xl aspect-square object-cover"
            width={500}
            height={500}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-black">FIL-B NFT</h2>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-black">~{price} FIL</span>
            <ArrowPathIcon
              onClick={fetchFilPrice}
              className="h-5 w-5 text-black cursor-pointer hover:rotate-180 transition-transform"
            />
          </div>
          <div className="card-actions justify-end mt-4">
            <button onClick={handleUpdateAndMint} className="btn btn-primary w-full text-lg">
              Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
