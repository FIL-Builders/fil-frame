import { useMutation, useQuery } from "@tanstack/react-query";
import { Abi, AbiFunction, Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { LighthouseChains } from "~~/hooks/lighthouse/utils";

// Change the contract function name to match the contract function name in the contract ABI that you want to interact with
export const mintPrivateFunction: AbiFunction = {
  inputs: [
    {
      internalType: "string",
      name: "lighthouse_cid",
      type: "string",
    },
    {
      internalType: "address[]",
      name: "accessList",
      type: "address[]",
    },
  ],
  name: "mintPrivate",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

// Change the contract function name to match the contract function name in the contract ABI that you want to interact with
export const mintFunction: AbiFunction = {
  inputs: [
    {
      internalType: "string",
      name: "lighthouse_cid",
      type: "string",
    },
  ],
  name: "mint",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

export const getConditions = (contractAddress: string, chainID: number, tokenId: number) => {
  return {
    conditions: [
      {
        id: 1,
        chain: LighthouseChains[chainID as keyof typeof LighthouseChains]?.name,
        method: "hasAccess",
        standardContractType: "Custom",
        contractAddress: `${contractAddress}`,
        returnValueTest: {
          comparator: "==",
          value: "true",
        },
        parameters: [`${tokenId}`, ":userAddress"],
        inputArrayType: ["uint256", "address"],
        outputType: "bool",
      },
    ],
    aggregator: "([1])",
  };
};

// Custom hook to fetch token data using useQuery
export const useFetchTokensData = (lighthouseNFTAddress: Address, lighthouseNFTAbi: any, publicClient: any) => {
  const { address } = useAccount();

  const { data: tokensData, isLoading } = useQuery({
    queryKey: ["tokensData", lighthouseNFTAddress, address],
    queryFn: async () => {
      if (!lighthouseNFTAddress || !publicClient) {
        return new Map<number, { isOpen: boolean; cid: string }>();
      }

      const totalNFTs = (await publicClient.readContract({
        address: lighthouseNFTAddress,
        functionName: "getTotalSupply",
        abi: lighthouseNFTAbi,
      })) as number;

      const dataMap = new Map<number, { isOpen: boolean; cid: string }>();
      for (let tokenId = 1; tokenId <= totalNFTs; tokenId++) {
        try {
          const tokenUriData = (await publicClient.readContract({
            address: lighthouseNFTAddress,
            functionName: "tokenURI",
            args: [BigInt(tokenId)],
            abi: lighthouseNFTAbi,
          })) as string;

          const isOpenToken = (await publicClient.readContract({
            address: lighthouseNFTAddress,
            functionName: "isOpenToken",
            args: [BigInt(tokenId)],
            abi: lighthouseNFTAbi,
          })) as boolean;

          dataMap.set(tokenId, { isOpen: isOpenToken, cid: tokenUriData });
        } catch (error) {
          console.error(`Failed to fetch tokenURI for tokenId ${tokenId}:`, error);
        }
      }
      return dataMap;
    },
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const tokenIdsArray = tokensData ? Array.from(tokensData.keys()) : [];

  return { tokensData, tokenIdsArray, isLoading };
};

export const useGetTotalSupply = () => {
  const publicClient = usePublicClient();
  return useMutation({
    mutationFn: async ({
      nftContractAddress,
      nftContractAbi,
    }: {
      nftContractAddress: Address;
      nftContractAbi: Abi;
    }) => {
      if (!publicClient) {
        throw new Error("Wallet client not found");
      }

      return publicClient.readContract({
        address: nftContractAddress,
        functionName: "getTotalSupply",
        abi: nftContractAbi,
      });
    },
  });
};

export const useTotalNFTsQuery = (nftContractAddress: Address, nftContractAbi: Abi) => {
  const { mutateAsync: getTotalSupply } = useGetTotalSupply();
  const { data: totalNFTs, isLoading } = useQuery({
    queryKey: ["totalSupply", nftContractAddress],
    queryFn: async () => {
      return getTotalSupply({ nftContractAddress, nftContractAbi });
    },
  });
  return { totalNFTs, isLoading };
};

export const useGetHasAccess = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({
      tokenId,
      nftContractAddress,
      ntfContractAbi,
    }: {
      tokenId: bigint;
      nftContractAddress: Address;
      ntfContractAbi: Abi;
    }) => {
      if (!publicClient || !address) {
        throw new Error("Wallet client not found");
      }

      return publicClient.readContract({
        address: nftContractAddress,
        functionName: "hasAccess",
        args: [tokenId, address],
        abi: ntfContractAbi,
      });
    },
  });
};
