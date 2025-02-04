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
import { useLighthouseFilesUpload } from "~~/hooks/lighthouse/useUpload";

const FIL_PRICE_FEED_ID = "0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e";
const PYTH_FIL_USD_ENDPOINT = `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${FIL_PRICE_FEED_ID}`;

const Home: NextPage = () => {
  const { address: connectedAddress, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [price, setPrice] = useState(0);
  const { writeContract, data: hash, isError, error } = useWriteContract();
  const [cid, setCid] = useState<string | null>(null);
  const [metadataCid, setMetadataCid] = useState<string | null>(null);
  const [useExistingFile, setUseExistingFile] = useState(false);
  const uploadMetadata = useLighthouseFilesUpload({
    onUploadSuccess: async (cid: string) => {
      console.log("Metadata uploaded successfully", cid);
      setMetadataCid(`https://gateway.lighthouse.storage/ipfs/${cid}`);
    },
    onUploadError: (error: Error) => {
      console.error("Error uploading file", error);
    },
  });

  const uploadFile = useLighthouseFilesUpload({
    onUploadSuccess: async (cid: string) => {
      console.log("Image uploaded successfully", cid);
      setCid(cid);
      const metadata = {
        name: "FIL-B NFT",
        description: "FIL-B NFT",
        image: `https://gateway.lighthouse.storage/ipfs/${cid}`,
      };
      const file = new File([JSON.stringify(metadata)], "metadata.json", { type: "application/json" });
      await uploadMetadata([file]);
    },
    onUploadError: (error: Error) => {
      console.error("Error uploading file", error);
    },
  });

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
  if (!chainId) return;

  const networkContracts = deployedContracts[chainId as keyof typeof deployedContracts];
  const pythContractDeployment = networkContracts?.PythContract;

  if (!pythContractDeployment) {
    return (
      <div className="flex flex-col  text-center min-h-screen bg-base-200 mt-[25%]">
        <div className="text-2xl font-bold">No Pyth contract deployment found</div>
        <div className="text-lg">Please deploy the Pyth contract using the hardhat package</div>
      </div>
    );
  }

  const metadataCidToUse = useExistingFile
    ? "https://ipfs.io/ipfs/bafkreicj46qq62emsjp77c5u4iw2fwgmbrvd7vaig4jso4qg56mz3y4hfm"
    : metadataCid ?? "https://ipfs.io/ipfs/bafkreicj46qq62emsjp77c5u4iw2fwgmbrvd7vaig4jso4qg56mz3y4hfm";

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
      console.log("metadataCidToUse", metadataCidToUse);

      console.log("Submitting transaction...");

      const oneDollarInFil = 1 / (data.parsed[0].price.price * 10 ** data.parsed[0].price.expo);

      // If we do exactly one dollar, we may get an insufficient fee error
      const price = String(oneDollarInFil + oneDollarInFil * 0.01);

      await writeContract({
        address: pythContractDeployment.address,
        abi: pythContractDeployment.abi,
        functionName: "updateAndMint",
        args: [priceFeedUpdateData as any, metadataCidToUse],
        value: parseEther(price),
      });
    } catch (error) {
      console.error("Error in handleUpdateAndMint:", error);
    }
  };

  const handleUploadFileFromEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile([file]);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-base-200">
      <div
        className="card w-96 mt-10 bg-white shadow-xl"
        style={{ height: !useExistingFile && !cid ? "620px" : "560px" }}
      >
        <div className="flex flex-col items-center">
          <label className="cursor-pointer label gap-2">
            <span className="label-text text-black font-semibold">
              {useExistingFile ? "use default nft image" : "upload nft image"}
            </span>
            <input
              type="checkbox"
              className="toggle"
              checked={useExistingFile}
              onChange={() => setUseExistingFile(!useExistingFile)}
            />
          </label>
        </div>
        {!useExistingFile ? (
          <figure className="px-8">
            {cid ? (
              <Image
                src={`https://gateway.lighthouse.storage/ipfs/${cid}`}
                alt="FIL-B NFT"
                className="rounded-xl aspect-square object-cover"
                width={400}
                height={400}
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl h-8 w-58"
                  onChange={handleUploadFileFromEvent}
                />
                <Image
                  src={cid ? `https://gateway.lighthouse.storage/ipfs/${cid}` : "/fil-b-nft.png"}
                  alt="FIL-B NFT"
                  className="rounded-xl aspect-square object-cover"
                  width={400}
                  height={400}
                />
              </div>
            )}
          </figure>
        ) : (
          <figure className="px-8 ">
            <Image
              src="/fil-b-nft.png"
              alt="FIL-B NFT"
              className="rounded-xl aspect-square object-cover "
              width={600}
              height={600}
            />
          </figure>
        )}
        <div className="card-body ">
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
