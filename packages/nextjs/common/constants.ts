import * as chains from "viem/chains";

export const targetNetworks = [chains.hardhat];
export const pollingInterval = 30000;
export const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";
export const onlyLocalBurnerWallet = true;
