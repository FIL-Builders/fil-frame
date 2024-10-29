"use client";

import React, { useState } from "react";

// import { ToastContainer, toast } from "react-toastify";

const AxelarPage: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    // write(); // Initiating the contract call
    console.log("asdf");
    // toast.info("Sending message...", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    //   draggable: true,
    // });
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Fullstack Interchain dApp with <span className="text-blue-500">Axelar 🔥 </span>
      </h1>
      <p className=" mb-8 text-center max-w-3xl text-gray-500">
        An interchain decentralized application using React, Solidity, and Axelar General Message Passing that allows
        users to send messages between FIL and ETH. This is built off of{" "}
        <a
          href="https://github.com/axelarnetwork/fullstack-interchain-dapp-example"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Axelar&apos;s example repo
        </a>
      </p>

      <div className="flex justify-center max-w-3xl">
        <div className="border border-gray-300 rounded-lg p-8 m-2 ">
          <h2 className="text-2xl font-bold mb-4">Send Message 📓 </h2>
          <textarea
            type="text"
            placeholder="Message"
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
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
          {/* {value ? (
                       <>
                           <p className="font-semibold mb-4">
                               From:{" "}
                               <span className="font-normal text-gray-500">
                                   {" "}
                                   {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)}
                               </span>
                           </p>
                           <p className="font-semibold mb-4">
                               To:{" "}
                               <span className="font-normal text-gray-500">
                                   {sourceChain ? "Sepolia" : null}
                               </span>
                           </p>
                           <p className="font-semibold mb-4">
                               Message:{" "}
                               <span className="font-normal text-gray-500">{value}</span>
                           </p>
                       </>
                   ) : (
                       <span className="text-red-500 ">waiting for response...</span>
                   )} */}
        </div>
      </div>
    </main>
  );
};

export default AxelarPage;
