import { uploadFiles } from "./index";
import { getUserAPIKey } from "./utils";
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

type UploadOptions = {
  onUploadSuccess?: (cid: string) => Promise<void>;
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
