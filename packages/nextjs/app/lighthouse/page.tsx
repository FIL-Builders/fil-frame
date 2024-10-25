"use client";

import { LighthouseNFTContracts } from "./_components/LighthouseNFTContracts";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/fil-frame";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col  pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">FIL-Frame</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started with Lighthouse.
            <br />
            First, go to{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/README.md
            </code>{" "}
            for details on deploying the NFTContract.
            <br />
            Then, go to{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/README.md
            </code>{" "}
            for details on setting up the Next.js app
          </p>
        </div>
      </div>
      <LighthouseNFTContracts />
    </>
  );
};

export default Home;
