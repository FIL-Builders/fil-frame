import { useUploadFile, useUploadFolder } from "./useUpload";
import { notification } from "~~/utils/fil-frame";

type UploadOptions = {
  onUploadSuccess?: (cid: string) => void;
  onUploadError?: (error: any) => void;
};

export const useFileUpload = (options?: UploadOptions) => {
  const mutation = useUploadFile();

  const uploadFile = async (file: string | File | Blob) => {
    let notificationId = null;
    try {
      notificationId = notification.loading("Uploading file...");

      const cid = await mutation.mutateAsync(file);

      notification.remove(notificationId);
      notification.success("File uploaded successfully!");

      if (options?.onUploadSuccess) {
        options.onUploadSuccess(cid);
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

  return uploadFile;
};

export const useFolderUpload = (options?: UploadOptions) => {
  const mutation = useUploadFolder();

  const uploadFolder = async (files: string[] | File[] | Blob[]) => {
    let notificationId = null;
    try {
      notificationId = notification.loading("Uploading folder...");

      const cid = await mutation.mutateAsync(files);

      notification.remove(notificationId);
      notification.success("Folder uploaded successfully!");

      if (options?.onUploadSuccess) {
        options.onUploadSuccess(cid);
      }

      return cid;
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      const message = error?.message || "Folder upload failed";
      notification.error(message);
      if (options?.onUploadError) {
        options.onUploadError(error);
      }
    }
  };

  return uploadFolder;
};
