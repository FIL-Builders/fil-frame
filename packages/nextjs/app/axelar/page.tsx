"use client";

import React, { useEffect, useState } from "react";
import deployedContracts from "../../contracts/deployedContracts";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";

const FIL_CONTRACT_ADDRESS = deployedContracts[314159].SendMessage.address;
const ETH_CONTRACT_ADDRESS = deployedContracts[11155111].SendMessage.address;
const ABI = deployedContracts[11155111].SendMessage.abi;

const AxelarPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState("");
  const [sourceChain, setSourceChain] = useState("");

  const { isPending, isSuccess, writeContract } = useWriteContract();

  const handleSendMessage = () => {
    writeContract({
      address: FIL_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "sendMessage",
      args: ["ethereum-sepolia", ETH_CONTRACT_ADDRESS, message],
      value: ethers.parseEther("5"),
    });
  };

  async function readDestinationChainVariables() {
    try {
      const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
      const contract = new ethers.Contract(ETH_CONTRACT_ADDRESS, ABI, provider);
      const value = await contract.value();
      const sourceChain = await contract.sourceChain();

      setValue(value.toString());
      setSourceChain(sourceChain.toString());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    readDestinationChainVariables();
  }, []);

  return (
    <main className="flex-grow flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2 text-center">
        FIL ➔ ETH Interchain dApp with <span className="text-blue-500">Axelar 🔥 </span>
      </h1>
      <p className=" mb-8 text-center max-w-3xl text-gray-500">
        {`Follow the `}
        <a
          href="https://github.com/FIL-Builders/fil-frame/tree/axelar-integration"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          README.md
        </a>
        {` to get started with deploying the contracts! This is built off of `}
        <a
          href="https://github.com/axelarnetwork/fullstack-interchain-dapp-example"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Axelar&apos;s example repo
        </a>
        .
      </p>

      <div className="flex justify-center max-w-3xl">
        <div className="border border-gray-300 rounded-lg p-8 m-2 ">
          <h2 className="text-2xl font-bold mb-4">Send Message 📓 </h2>
          <textarea
            placeholder="Message"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            style={{ height: "100px" }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
            onClick={() => handleSendMessage()}
          >
            Send
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg p-8 m-2 w-2/5">
          <h2 className="text-2xl font-bold mb-4">Response 🎉 </h2>
          <div style={{ height: "125px" }}>
            {value ? (
              <>
                <p className="font-semibold mb-4">
                  {`From: `}
                  <span className="font-normal text-gray-500">
                    {" "}
                    {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)}
                  </span>
                </p>
                <p className="font-semibold mb-4">
                  {`To: `}
                  <span className="font-normal text-gray-500">{sourceChain ? "Sepolia" : null}</span>
                </p>
                <p className="font-semibold mb-4">
                  {`Message: `}
                  <span className="font-normal text-gray-500">{value}</span>
                </p>
              </>
            ) : (
              <span className="text-red-500 ">waiting for response...</span>
            )}
          </div>
          <button
            onClick={() => readDestinationChainVariables()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="mt-4">
        {isSuccess ? (
          <span>
            Message sent successfully! Wait a couple of minutes before searching for the txn on{" "}
            <a
              href="https://testnet.axelarscan.io/gmp/search"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Axelarscan
            </a>
            .
          </span>
        ) : isPending ? (
          <span className="text-yellow-500">Sending message...</span>
        ) : null}
      </div>
    </main>
  );
};

export default AxelarPage;
