"use client";

import { useState } from "react";
import { NextPage } from "next";

const Home: NextPage = () => {
  const [price, setPrice] = useState(0);
  const fetchPythData = async () => {
    try {
      const response = await fetch(
        "https://hermes.pyth.network/v2/updates/price/latest?ids[]=0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e",
      );
      const data = await response.json();
      setPrice(data.parsed[0].price.price * 10 ** data.parsed[0].price.expo);
      console.log("Pyth Price Data:", data.parsed[0].price);
    } catch (error) {
      console.error("Error fetching Pyth data:", error);
    }
  };

  return (
    <>
      <div>
        <h1>Pyth</h1>
        <button
          onClick={fetchPythData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Pyth Prices
        </button>
        <p>Price: {price}</p>
      </div>
    </>
  );
};

export default Home;
