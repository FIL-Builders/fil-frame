"use client";

import { useMemo, useState } from "react";
import { mintPrivateFunction, useTotalNFTsQuery } from "../utils";
import { LigthouseLitEnctyptedFileUpload } from "./LighthouseUpload";
import { WriteContractFunctionForm } from "./WriteContractFunctionForm";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const MintPrivateNFTForm = () => {
  const [imageCid, setImageCid] = useState<string | null>(null);
  const { chainId } = useAccount();
  const contractsData = useAllContracts();
  // Find the LitEncryptedNFT contract address
  const [LitEncryptedNFTAddress, Abi] = useMemo(() => {
    // Change the contract name to match the contract name in the contractsData object by default it is LitEncryptedNFT
    const nftContract = Object.entries(contractsData).find(([name]) => name === "LitEncryptedNFT");
    return nftContract ? [nftContract[1].address, nftContract[1].abi] : [null, null];
  }, [contractsData]);

  const handleGetCID = (cid: string) => {
    setImageCid(cid);
  };

  // Fetch total supply
  const { totalNFTs } = useTotalNFTsQuery(LitEncryptedNFTAddress as Hex, Abi as any);
  const nextToken = totalNFTs ? Number(totalNFTs) + 1 : 1;
  const chain = chainId === 371 ? "filecoin" : "filecoin";
  // const conditions = getConditions(LitEncryptedNFTAddress as string, chainId as number, nextToken);
  return (
    <div className="flex flex-col items-center space-y-4 p-5 w-full bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6  py-4">
      <h2 className="text-2xl font-bold">Mint Your Private NFT</h2>
      <LigthouseLitEnctyptedFileUpload
        handleGetCID={handleGetCID}
        acceptMimeType="image/*"
        tokenId={nextToken}
        chain={chain}
        contractAddress={LitEncryptedNFTAddress as string}
      />
      {imageCid && LitEncryptedNFTAddress && (
        <WriteContractFunctionForm
          abi={Abi}
          abiFunction={mintPrivateFunction}
          contractAddress={LitEncryptedNFTAddress}
          onChange={() => void 0}
          functionPropsWithIndexAndValue={[{ index: 0, value: imageCid }]}
        />
      )}
    </div>
  );
};
