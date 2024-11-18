"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { DealInputs, createDealObject, getDefaultDealInputs } from "../utils";
import { Abi, AbiFunction } from "abitype";
import { JsonView, allExpanded, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { Address, TransactionReceipt } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  ContractInput,
  TxReceipt,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "~~/app/debug/_components/contract";
import { InheritanceTooltip } from "~~/app/debug/_components/contract/InheritanceTooltip";
import { IntegerInput } from "~~/components/fil-frame";
import { useTransactor } from "~~/hooks/fil-frame";
import { useTargetNetwork } from "~~/hooks/fil-frame/useTargetNetwork";
import { DealInfoData } from "~~/hooks/lighthouse/useUpload";

type WriteContractFunctionProps = {
  abi: Abi;
  abiFunction: AbiFunction;
  onChange: () => void;
  contractAddress: Address;
  inheritedFrom?: string;
  dealParams?: DealInfoData;
};

export const WriteContractFunctionForm = ({
  abi,
  abiFunction,
  onChange,
  contractAddress,
  inheritedFrom,
  dealParams,
}: WriteContractFunctionProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [txValue, setTxValue] = useState<string>("");
  const { chain } = useAccount();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;

  const { data: result, isPending, writeContractAsync } = useWriteContract();

  const handleWrite = async () => {
    if (writeContractAsync) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: contractAddress,
            functionName: abiFunction.name,
            abi: abi,
            args: getParsedContractFunctionArgs(form),
            value: BigInt(txValue),
          });
        await writeTxn(makeWriteWithParams);
        onChange();
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  // TODO use `useMemo` to optimize also update in ReadOnlyFunctionForm
  const transformedFunction = transformAbiFunction(abiFunction);
  const inputs = transformedFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setDisplayedTxResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });
  const zeroInputs = inputs.length === 0 && abiFunction.stateMutability !== "payable";
  const defaultDealInputs = useMemo(() => getDefaultDealInputs(dealParams), [dealParams]);
  const [dealInputs, setDealInputs] = useState<DealInputs>(defaultDealInputs);

  const setFormValue = () => {
    const dealObject = createDealObject(dealInputs);
    setForm(prevForm => ({
      ...prevForm,
      ["makeDealProposal_deal_struct DealRequest_tuple"]: JSON.stringify(dealObject),
    }));
  };

  useEffect(() => {
    setFormValue();
  }, [dealParams]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDealInputs(prevInputs => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        <p className="font-medium my-0 break-words ">
          {abiFunction.name}
          <InheritanceTooltip inheritedFrom={inheritedFrom} />
        </p>

        <DealForm dealInputs={dealInputs} handleInputChange={handleInputChange} />

        <JsonView data={createDealObject(dealInputs)} style={darkStyles} shouldExpandNode={allExpanded} />

        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="block text-xs font-extralight leading-none">wei</span>
            </div>
            <IntegerInput
              value={txValue}
              onChange={updatedTxValue => {
                setDisplayedTxResult(undefined);
                setTxValue(updatedTxValue);
              }}
              placeholder="value (wei)"
            />
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          {!zeroInputs && (
            <div className="flex-grow basis-0">
              {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
            </div>
          )}
          <div
            className={`flex ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
          >
            <button className="btn btn-secondary btn-sm" disabled={writeDisabled || isPending} onClick={handleWrite}>
              {isPending && <span className="loading loading-spinner loading-xs"></span>}
              Send 💸
            </button>
          </div>
        </div>
      </div>
      {zeroInputs && txResult ? (
        <div className="flex-grow basis-0">
          <TxReceipt txResult={txResult} />
        </div>
      ) : null}
    </div>
  );
};

const DealForm = ({
  dealInputs,
  handleInputChange,
}: {
  dealInputs: DealInputs;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const months = Math.max(7, Math.min(36, Number(e.target.value)));
    const endEpoch = dealInputs.start_epoch + months * 43200;
    handleInputChange({
      ...e,
      // @ts-ignore: number to string conversion
      target: { ...e.target, name: "end_epoch", value: endEpoch },
    });
  };

  return (
    <form className="flex flex-col items-center justify-center text-lg p-6 border-base-300 border shadow-md shadow-secondary rounded-3xl">
      <label className="flex flex-col gap-3">
        Duration (Months)
        <input
          type="number"
          min="7"
          max="36"
          value={(dealInputs.end_epoch - dealInputs.start_epoch) / 43200}
          onChange={handleDurationChange}
          placeholder="Duration in Months"
          className="rounded-xl p-2 bg-black text-white"
        />
      </label>
    </form>
  );
};
