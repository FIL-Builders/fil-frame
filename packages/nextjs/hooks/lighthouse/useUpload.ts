import { uploadFiles, uploadFilesEncrypted } from "./index";
import { getUserAPIKey } from "./utils";
import { useMutation } from "@tanstack/react-query";
import CID from "cids";
import { bytesToHex } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { notification } from "~~/utils/fil-frame";

export type DealInfoData = {
  carLink: string;
  carSize: number;
  pieceCid: string;
  pieceSize: number;
  mimeType: string;
  dealStartBlock: number;
  dealEndBlock: number;
};

const oneBlock = 30; // 30 seconds
const oneMinute = 60; // 60 seconds
const oneHour = 60; // 60 minutes
const oneDay = 24; // 24 hours
const oneMonth = 30; // 30 days

export const useGetFilecoinDealParams = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({ file, dealDurationInMonths }: { file: File; dealDurationInMonths: number }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error("Wallet client not found");
      }
      // Deal Duration should be 6.5 months to 3.5years max
      if (dealDurationInMonths < 6.5 || dealDurationInMonths > 42) {
        throw new Error("Deal duration should be between 6.5 months and 3.5 years.");
      }

      const totalBlocks = (dealDurationInMonths * oneMonth * oneDay * oneHour * oneMinute) / oneBlock;

      // Get the current block nummber
      const blockNumber = await publicClient.getBlockNumber();
      const block = await publicClient.getBlock();
      console.log("Current block number:", blockNumber, block);
      const dealStartBlock = Number(blockNumber) + 6000; // Start the deal after 100 blocks
      const dealEndBlock = dealStartBlock + totalBlocks;

      const apiKey = await getUserAPIKey(address, walletClient);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("apiKey", apiKey);

      try {
        const res = await fetch("/api/lighthouse", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          const returnedData = data.result;
          const pieceCid = returnedData.pieceCid;
          const bytesCommp = new CID(pieceCid).bytes;
          const cidHex = bytesToHex(bytesCommp as Uint8Array);
          return {
            ...returnedData,
            pieceCid: cidHex,
            dealStartBlock,
            dealEndBlock,
          } as DealInfoData;
        } else {
          throw new Error(data.error || "Upload failed.");
        }
      } catch (err) {
        throw new Error("An error occurred.");
      }
    },
  });
};

export type dealClientUploadOptions = {
  onUploadSuccess: (dealInfoData: DealInfoData) => void;
  onUploadError: (error: any) => void;
};

export const useLighthouseGetFilecoinDealParams = (options: dealClientUploadOptions) => {
  const mutation = useGetFilecoinDealParams();
  const getFileDealParams = async (file: File, dealDurationInMonths: number) => {
    let notificationId = null;
    try {
      notificationId = notification.loading(`Uploading file...`);
      const params = await mutation.mutateAsync({ file, dealDurationInMonths });
      notification.remove(notificationId);
      notification.success(`File uploaded successfully!`);
      options.onUploadSuccess(params);

      return params; // Return DealInfoData on success
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      const message = error?.message || "Error getting deal params";
      notification.error(message);
      console.error("Error uploading file:", error);
      options.onUploadError(error);
      throw new Error(message);
    }
  };
  return getFileDealParams;
};
