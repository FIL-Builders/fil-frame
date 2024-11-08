"use client";

import { useEffect, useMemo } from "react";
import { DealClientUI } from "./DealClientUI";
import { FileDealForm } from "./FileDealForm";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractName, GenericContract } from "~~/utils/fil-frame/contract";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

const selectedContractStorageKey = "FilFrame2.selectedContract";

export function DealClientContracts() {
  const contractsData = useAllContracts();
  const contractNames = useMemo(
    () => Object.keys(contractsData).filter(contractName => contractName === "DealClient") as ContractName[],
    [contractsData],
  );

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
              <div className="tabs flex-1 items-center ">Create a deal</div>
            </div>
            <div className="flex w-full max-w-7xl px-6">
              <FileDealForm />
            </div>

            {contractNames.map(contractName => (
              <DealClientUI
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
