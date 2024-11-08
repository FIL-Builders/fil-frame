import * as chains from "viem/chains";
export const akaveFuji = {
  id: 78963,
  name: "Akave Fuji",
  nativeCurrency: {
    decimals: 18,
    name: "AKAVE",
    symbol: "AKVF",
  },
  rpcUrls: {
    default: {
      http: ["https://node1-asia.ava.akave.ai/ext/bc/tLqcnkJkZ1DgyLyWmborZK9d7NmMj6YCzCFmf9d9oQEd2fHon/rpc"],
    },
    public: {
      http: ["https://node1-asia.ava.akave.ai/ext/bc/tLqcnkJkZ1DgyLyWmborZK9d7NmMj6YCzCFmf9d9oQEd2fHon/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Akave Testnet Explorer",
      url: "http://explorer.akave.ai",
    },
  },
  testnet: true,
} as const satisfies chains.Chain;


export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};


const scaffoldConfig = {
  // The networks on which your DApp is live
  // Note: The network is calibration by default due to Filecoin-specific libraries being used (e.g. deal client)
  targetNetworks: [akaveFuji],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;