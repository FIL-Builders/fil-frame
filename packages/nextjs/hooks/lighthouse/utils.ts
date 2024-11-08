import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";
import { Hex, WalletClient } from "viem";
import { notification } from "~~/utils/fil-frame";

export const LighthouseChains = {
  314: {
    name: "Filecoin",
  },
  314159: {
    name: "Filecoin_Testnet",
  },
};

export const getIpfsGatewayUri = (cid: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/{cid}";
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getIpfsCID = (ipfsCIDLink: string) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/";
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};


export const getLighthouseAPIKey = (userAddress: string) => {
  let apiKey: string | null = null;
  try {
    apiKey = localStorage.getItem(`lighthouse-api-key-${userAddress.toLowerCase()}`);
  } catch (e) {}
  return apiKey;
};

export const getUserAPIKey = async (address: Hex, walletClient: WalletClient) => {
  const addressLowerCase = address.toLowerCase();
  let apiKey = getLighthouseAPIKey(address);
  if (!apiKey) {
    try {
      let notificationId = notification.info("Sign in to Lighthouse to upload files");
      const verificationMessage = (
        await axios.get(`https://api.lighthouse.storage/api/auth/get_message?publicKey=${addressLowerCase}`)
      ).data;
      notification.remove(notificationId);
      notificationId = notification.loading("Signing message...");
      const signedMessage = await walletClient.signMessage({
        account: address,
        message: verificationMessage,
      });
      const response = await lighthouse.getApiKey(addressLowerCase, signedMessage);
      notification.success("Signed in to Lighthouse");
      notification.remove(notificationId);
      apiKey = response.data.apiKey;
      localStorage.setItem(`lighthouse-api-key-${addressLowerCase}`, apiKey);
    } catch (e) {
      notification.error("Error signing in to Lighthouse");
      throw new Error("Error signing in to Lighthouse");
    }
  }
  return apiKey;
};
