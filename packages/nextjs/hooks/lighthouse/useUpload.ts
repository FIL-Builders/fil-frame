import { accessControlConditions } from "../lighthouse/types";
import { uploadFiles, uploadFilesEncrypted } from "./index";
import { getUserAPIKey, getUserJWT } from "./utils";
import { useMutation } from "@tanstack/react-query";
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

export const useUploadEncryptedFile = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({
      files,
      accessControlConditions,
    }: {
      files: File[];
      accessControlConditions: {
        conditions: accessControlConditions[];
        aggregate: string;
      };
    }) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not found");
      }
      const apiKey = await getUserAPIKey(address, walletClient);
      const jwt = await getUserJWT(address, walletClient);
      if (!jwt) {
        throw new Error("Error signing in to Lighthouse");
      }
      return uploadFilesEncrypted(
        files,
        apiKey,
        address,
        jwt,
        accessControlConditions.conditions,
        accessControlConditions.aggregate,
      );
    },
  });
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

export const useLighthouseEncryptedFilesUpload = (options?: UploadOptions) => {
  const mutation = useUploadEncryptedFile();
  const uploadFile = async (
    files: File[],
    accessControlConditions: { conditions: accessControlConditions[]; aggregate: string },
  ) => {
    let notificationId = null;
    const msg = files.length > 1 ? "files" : "file";

    try {
      notificationId = notification.loading(`Uploading Encrypted ${msg}...`);
      const cid = await mutation.mutateAsync({ files, accessControlConditions });
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
