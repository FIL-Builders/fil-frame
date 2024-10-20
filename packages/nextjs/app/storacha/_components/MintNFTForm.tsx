"use client";

import { useMemo, useState } from "react";
import { StorachaFileUpload } from "./StorachaUpload";
import { WriteContractFunctionForm } from "./WriteContractFunctionForm";
import { AbiFunction } from "abitype";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

// Change the contract function name to match the contract function name in the contract ABI that you want to interact with
const mintFunction: AbiFunction = {
  inputs: [
    {
      internalType: "string",
      name: "storacha_cid",
      type: "string",
    },
  ],
  name: "mint",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

export const MintNFTForm = () => {
  const [imageCid, setImageCid] = useState<string | null>(null);
  const contractsData = useAllContracts();
  // Find the StorachaNFT contract address
  const [storachaNFTAddress, Abi] = useMemo(() => {
    // Change the contract name to match the contract name in the contractsData object by default it is StorachaNFT
    const storachaContract = Object.entries(contractsData).find(([name]) => name === "StorachaNFT");
    return storachaContract ? [storachaContract[1].address, storachaContract[1].abi] : [null, null];
  }, [contractsData]);

  const handleGetCID = (cid: string) => {
    setImageCid(cid);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-5 w-full bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6  py-4">
      <h2 className="text-2xl font-bold">Mint Your NFT</h2>
      <StorachaFileUpload handleGetCID={handleGetCID} acceptMimeType="image/*" />
      {imageCid && storachaNFTAddress && (
        <WriteContractFunctionForm
          abi={Abi}
          abiFunction={mintFunction}
          contractAddress={storachaNFTAddress}
          onChange={() => void 0}
          functionPropsWithIndexAndValue={[{ index: 0, value: imageCid }]}
        />
      )}
    </div>
  );
};
