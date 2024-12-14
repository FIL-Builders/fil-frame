import { chainIdToLitNetwork } from "../lit/types";
import { Lit } from "../lit/utils";
import { uploadFiles } from "./index";
import { getUserAPIKey } from "./utils";
import { useMutation } from "@tanstack/react-query";
import { Hex } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { notification } from "~~/utils/fil-frame";

export const useUploadFile = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      if (!walletClient || !address) {
        console.log("Wallet client not found");
        return;
      }
      const apiKey = await getUserAPIKey(address, walletClient);
      return await uploadFiles(files, apiKey);
    },
  });
};
export const _useUploadEncryptedFile = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({
      files,
      tokenId,
      contractAddress,
    }: {
      files: File[];
      tokenId: number;
      contractAddress: string;
    }) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not found");
      }
      const chainId = walletClient?.chain.id;
      const chain = chainIdToLitNetwork[chainId];
      const apiKey = await getUserAPIKey(address, walletClient);
      return await UploadFileEncrypted({
        file: files[0],
        tokenId: tokenId,
        address: contractAddress as Hex,
        chain: chain,
        apiKey,
      });
    },
  });
};

export const useUploadEncryptedFile = (options?: UploadOptions) => {
  const mutation = _useUploadEncryptedFile();
  const uploadEncryptedFile = async ({
    files,
    tokenId,
    contractAddress,
  }: {
    files: File[];
    tokenId: number;
    contractAddress: string;
  }) => {
    let notificationId = null;
    try {
      notificationId = notification.loading("Uploading file...");
      const cid = await mutation.mutateAsync({ files, tokenId, contractAddress });
      notification.remove(notificationId);
      notification.success("File uploaded successfully!");
      if (options?.onUploadSuccess) {
        options.onUploadSuccess(cid || "");
      }
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      const message = error?.message || "File upload failed";
      notification.error(message);
      if (options?.onUploadError) {
        options.onUploadError(error);
      }
    }
  };
  return uploadEncryptedFile;
};

type UploadOptions = {
  onUploadSuccess?: (cid: string) => void;
  onUploadError?: (error: any) => void;
};

export const useLighthouseFilesUpload = (options?: UploadOptions) => {
  const mutation = useUploadFile();
  const uploadFile = async (files: File[]) => {
    let notificationId = null;
    const msg = files.length > 1 ? "files" : "file";
    try {
      notificationId = notification.loading(`Uploading ${msg}...`);
      const cid = await mutation.mutateAsync({ files });
      notification.remove(notificationId);
      notification.success(`${msg} uploaded successfully!`);
      if (options?.onUploadSuccess) {
        options.onUploadSuccess(cid || "");
      }
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      const message = error?.message || `${msg} upload failed`;
      notification.error(message);
      if (options?.onUploadError) {
        options.onUploadError(error);
      }
    }
  };
  return uploadFile;
};

export const UploadFileEncrypted = async ({
  file,
  tokenId,
  address,
  chain,
  apiKey,
}: {
  file: File;
  tokenId: number;
  address: Hex;
  chain: string;
  apiKey: string;
}) => {
  const lit = new Lit(chain, tokenId, address);
  const encryptedPayload = JSON.stringify(
    (
      await lit.encryptNFT({
        file,
      })
    ).jsonPayload,
  );

  const encryptedFile = new File([encryptedPayload], "encryptedFile");
  const cid = await uploadFiles([encryptedFile], apiKey);
  return cid;
};
