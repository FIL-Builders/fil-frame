"use client";

import { useMemo, useState } from "react";
import { getConditions, mintPrivateFunction, useTotalNFTsQuery } from "../utils";
import { LigthouseEnctyptedFileUpload } from "./LighthouseUpload";
import { WriteContractFunctionForm } from "./WriteContractFunctionForm";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const MintPrivateNFTForm = () => {
  const [imageCid, setImageCid] = useState<string | null>(null);
  const { chainId } = useAccount();
  const contractsData = useAllContracts();
  // Find the LighthouseNFT contract address
  const [LighthouseNFTAddress, Abi] = useMemo(() => {
    // Change the contract name to match the contract name in the contractsData object by default it is LighthouseNFT
    const lighthouseContract = Object.entries(contractsData).find(([name]) => name === "LighthouseNFT");
    return lighthouseContract ? [lighthouseContract[1].address, lighthouseContract[1].abi] : [null, null];
  }, [contractsData]);

  const handleGetCID = (cid: string) => {
    setImageCid(cid);
  };

  // Fetch total supply
  const { totalNFTs } = useTotalNFTsQuery(LighthouseNFTAddress as Hex, Abi as any);
  const nextToken = totalNFTs ? Number(totalNFTs) + 1 : 1;
  const conditions = getConditions(LighthouseNFTAddress as string, chainId as number, nextToken);
  return (
    <div className="flex flex-col items-center space-y-4 p-5 w-full bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6  py-4">
      <h2 className="text-2xl font-bold">Mint Your Private NFT</h2>
      <LigthouseEnctyptedFileUpload
        handleGetCID={handleGetCID}
        acceptMimeType="image/*"
        accessControlConditions={{ conditions: conditions.conditions, aggregate: conditions.aggregator }}
      />
      {imageCid && LighthouseNFTAddress && (
        <WriteContractFunctionForm
          abi={Abi}
          abiFunction={mintPrivateFunction}
          contractAddress={LighthouseNFTAddress}
          onChange={() => void 0}
          functionPropsWithIndexAndValue={[{ index: 0, value: imageCid }]}
        />
      )}
    </div>
  );
};
