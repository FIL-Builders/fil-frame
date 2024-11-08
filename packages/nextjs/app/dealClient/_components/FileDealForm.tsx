"use client";

import { useMemo, useState } from "react";
import { makeDealFunction } from "../utils";
import { LighthouseGetFileDealParams } from "./LighthouseUpload";
import { WriteContractFunctionForm } from "./WriteContractFunctionForm";
import { DealInfoData } from "~~/hooks/lighthouse/useUpload";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const FileDealForm = () => {
  const [dealParams, setDealParams] = useState<DealInfoData | null>(null);
  const contractsData = useAllContracts();
  // Find the LighthouseNFT contract address
  const [DealClientAddress, Abi] = useMemo(() => {
    // Change the contract name to match the contract name in the contractsData object by default it is LighthouseNFT
    const dealClientContract = Object.entries(contractsData).find(([name]) => name === "DealClient");
    return dealClientContract ? [dealClientContract[1].address, dealClientContract[1].abi] : [null, null];
  }, [contractsData]);

  const handleGetDealParams = (params: DealInfoData) => {
    setDealParams(params);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-5 w-full bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6  py-4">
      <h2 className="text-2xl font-bold">Create a Filecoin Deal</h2>
      <LighthouseGetFileDealParams handleGetDealParams={handleGetDealParams} dealDurationInMonths={12} />
      {dealParams && DealClientAddress && (
        <WriteContractFunctionForm
          abi={Abi}
          abiFunction={makeDealFunction}
          contractAddress={DealClientAddress}
          onChange={() => void 0}
          dealParams={dealParams}
        />
      )}
    </div>
  );
};
