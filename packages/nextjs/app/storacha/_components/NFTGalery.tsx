import { useEffect, useState } from "react";
import Image from "next/image";
import { useContractRead, usePublicClient } from "wagmi";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const NFTGallery = () => {
  const contractsData = useAllContracts();
  const storachaNFTAddress = contractsData["StorachaNFT"]?.address;
  const publicClient = usePublicClient();

  const [cids, setCids] = useState<string[]>([]);

  // Fetch total supply
  const { data: supplyData } = useContractRead({
    address: storachaNFTAddress,
    functionName: "getTotalSupply",
    abi: [
      {
        inputs: [],
        name: "getTotalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  });

  // Fetch token URIs using a custom async function
  useEffect(() => {
    const fetchCids = async () => {
      if (supplyData && storachaNFTAddress && publicClient) {
        const cidsArray: string[] = [];
        for (let tokenId = 1; tokenId <= supplyData; tokenId++) {
          try {
            const tokenUriData = await publicClient.readContract({
              address: storachaNFTAddress,
              functionName: "tokenURI",
              args: [BigInt(tokenId)],
              abi: [
                {
                  inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
                  name: "tokenURI",
                  outputs: [{ internalType: "string", name: "", type: "string" }],
                  stateMutability: "view",
                  type: "function",
                },
              ],
            });
            if (tokenUriData) {
              cidsArray.push(tokenUriData);
            }
            console.log(`Fetched tokenURI for tokenId ${tokenId}:`, tokenUriData);
          } catch (error) {
            console.error(`Failed to fetch tokenURI for tokenId ${tokenId}:`, error);
          }
        }
        setCids(cidsArray);
      }
    };
    fetchCids();
  }, [supplyData, storachaNFTAddress]);

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
      {cids.map((cid, index) => (
        <NFTItem key={index} cid={cid} index={index} width={200} height={200} />
      ))}
    </div>
  );
};

export default NFTGallery;

const NFTItem = ({ cid, index, width, height }: { cid: string; index: number; width: number; height: number }) => (
  <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-1">
    <p className="text-center mt-2">NFT #{index + 1}</p>
    <Image
      src={`https://w3s.link/ipfs/${cid}`}
      alt={`NFT ${index + 1}`}
      width={width}
      height={height}
      className="rounded-lg"
    />
  </div>
);
