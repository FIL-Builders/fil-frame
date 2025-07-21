export interface LPACC_EVM_CONTRACT {
  conditionType?: string;
  contractAddress: string;
  chain:
    | "ethereum"
    | "polygon"
    | "fantom"
    | "xdai"
    | "bsc"
    | "arbitrum"
    | "arbitrumSepolia"
    | "avalanche"
    | "fuji"
    | "harmony"
    | "mumbai"
    | "goerli"
    | "cronos"
    | "optimism"
    | "celo"
    | "aurora"
    | "eluvio"
    | "alfajores"
    | "xdc"
    | "evmos"
    | "evmosTestnet"
    | "bscTestnet"
    | "baseGoerli"
    | "baseSepolia"
    | "moonbeam"
    | "moonriver"
    | "moonbaseAlpha"
    | "filecoin"
    | "filecoinCalibrationTestnet"
    | "hyperspace"
    | "sepolia"
    | "scrollAlphaTestnet"
    | "scroll"
    | "zksync"
    | "base"
    | "lukso"
    | "luksoTestnet"
    | "zora"
    | "zoraGoerli"
    | "zksyncTestnet"
    | "lineaGoerli"
    | "chronicleTestnet"
    | "yellowstone"
    | "lit"
    | "chiado"
    | "zkEvm"
    | "mantleTestnet"
    | "mantle"
    | "klaytn"
    | "publicGoodsNetwork"
    | "optimismGoerli"
    | "waevEclipseTestnet"
    | "waevEclipseDevnet"
    | "verifyTestnet"
    | "fuse"
    | "campNetwork"
    | "vanar"
    | "lisk"
    | "chilizMainnet"
    | "chilizTestnet"
    | "skaleTestnet"
    | "skale"
    | "fhenixHelium"
    | "hederaTestnet"
    | "bitTorrentTestnet"
    | "kintoTestnet";
  functionName: string;
  functionParams: string[];
  functionAbi: {
    name: string;
    type?: string;
    stateMutability: string;
    constant?: boolean;
    inputs: {
      name: string;
      type: string;
      internalType?: string;
    }[];
    outputs: {
      name: string;
      type: string;
      internalType?: string;
    }[];
  };
  returnValueTest: {
    key: string;
    comparator: "contains" | "=" | ">" | ">=" | "<" | "<=";
    value: string;
  };
}

export const chainIdToLitNetwork: Record<number, string> = {
  314: "filecoin",
  314159: "filecoinCalibrationTestnet",
  11155111: "sepolia",
  421611: "arbitrumSepolia",
  11155420: "optimismSepolia",
};
