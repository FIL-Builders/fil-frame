"use client";

import Link from "next/link";
import UploadForm from "../components/UploadForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/fil-frame";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="md:px-32">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">AKAVE | FIL-Frame</span>
          </h1>
          <p className="text-center text-lg">
            Experience seamless Web3 data management with Akave's S3-compatible gateway. Upload, store, and manage your data with 
            enterprise-grade reliability and Web2-like simplicity.
          </p>
          <p className="text-center text-lg">
            Leverage our advanced erasure coding and data sampling technology to ensure guaranteed data availability both on-chain 
            and off-chain, while maintaining cost efficiency.
          </p>
          <p className="text-center text-lg">
            Get started by uploading your files below and experience the power of decentralized storage with familiar S3-compatible 
            interfaces and developer-friendly SDKs.
          </p>
          {/* <div>
            <UploadForm />
          </div> */}
          {/* <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div> */}
        </div>

        <div className="flex-grow w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-white text-black px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-custom-black-box">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-white text-black px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-custom-black-box">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
