"use client";

import { useEffect, useMemo, useState } from "react";
import { LighthouseNFTUI } from "./LighthouseNFTUI";
import { MintNFTForm } from "./MintNFTForm";
import { MintPrivateNFTForm } from "./MintPrivateNFTForm";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractName, GenericContract } from "~~/utils/fil-frame/contract";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

const selectedContractStorageKey = "FilFrame2.selectedContract";

export function LighthouseNFTContracts() {
  const contractsData = useAllContracts();
  const contractNames = useMemo(() => Object.keys(contractsData) as ContractName[], [contractsData]);

  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [contractNames, selectedContract, setSelectedContract]);
  const [activeTab, setActiveTab] = useState<"private" | "open">("private");

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14">No contracts found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {contractNames.map(contractName => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {contractName}
                  {(contractsData[contractName] as GenericContract)?.external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External contract">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col items-center justify-between gap-3 mx-5">
            <div className="flex w-full max-w-7xl px-6">
              <div className="tabs flex-1 items-center ">
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    activeTab === "private" ? "bg-base-300 border" : "bg-base-100 hover:bg-secondary"
                  }`}
                  onClick={() => setActiveTab("private")}
                >
                  Mint Private NFT
                </button>
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    activeTab === "open" ? "bg-base-300 border" : "bg-base-100 hover:bg-secondary"
                  }`}
                  onClick={() => setActiveTab("open")}
                >
                  Mint Open NFT
                </button>
              </div>
            </div>
            <div className={`${activeTab === "open" ? "hidden" : ""} flex w-full max-w-7xl px-6`}>
              <MintPrivateNFTForm />
            </div>
            <div className={`${activeTab !== "open" ? "hidden" : ""} flex w-full max-w-7xl px-6`}>
              <MintNFTForm />
            </div>

            {contractNames.map(contractName => (
              <LighthouseNFTUI
                key={contractName}
                contractName={contractName}
                className={contractName === selectedContract ? "" : "hidden"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
