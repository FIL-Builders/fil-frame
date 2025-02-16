"use client";

import { DealClientContracts } from "./_components/DealClientContracts";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/fil-frame";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col  pt-10">
        <div className="px-5">
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
      </div>
      <DealClientContracts />
      <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
        Demo built on &nbsp;
        <a 
            href="https://github.com/FIL-Builders/onramp-contracts/tree/dev/LH" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
          >
          Multichain Data Bridge
        </a>
        &nbsp;&
        <a 
            href="https://www.lighthouse.storage/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
          >
          LHProtocol
        </a>
    </div>
    </>
  );
};

export default Home;
