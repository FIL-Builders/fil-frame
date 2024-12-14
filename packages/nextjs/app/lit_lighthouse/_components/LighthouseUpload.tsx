import { useLighthouseFilesUpload, useUploadEncryptedFile } from "~~/hooks/lighthouse/useUpload";

export const LighthouseFileUpload = ({
  handleGetCID,
  acceptMimeType,
}: {
  handleGetCID: (cid: string) => void;
  acceptMimeType?: string;
}) => {
  const uploadFile = useLighthouseFilesUpload({
    onUploadSuccess: cid => {
      handleGetCID(cid);
    },
    onUploadError: error => {
      console.error("Error uploading file:", error);
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile([file]);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleUpload}
        // accept everything
        accept={acceptMimeType ?? "*"}
        className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl"
      />
    </>
  );
};

export const LighthouseFolderUpload = ({
  handleGetCID,
  acceptMimeType,
}: {
  handleGetCID: (cid: string) => void;
  acceptMimeType?: string;
}) => {
  const uploadFiles = useLighthouseFilesUpload({
    onUploadSuccess: cid => {
      handleGetCID(cid);
    },
    onUploadError: error => {
      console.error("Error uploading files:", error);
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    // Convert FileList to array of files
    const files = Array.from(fileList || []);
    if (files && files.length > 0) {
      await uploadFiles(files);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        multiple
        accept={acceptMimeType ?? "*"}
        onChange={handleUpload}
        className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl"
      />
    </>
  );
};

export const LigthouseLitEnctyptedFileUpload = ({
  handleGetCID,
  acceptMimeType,
  tokenId,
  contractAddress,
}: {
  handleGetCID: (cid: string) => void;
  acceptMimeType?: string;
  tokenId: number;
  chain: string;
  contractAddress: string;
}) => {
  const uploadEncryptedFile = useUploadEncryptedFile({
    onUploadSuccess: cid => {
      handleGetCID(cid);
    },
    onUploadError: error => {
      console.error("Error uploading file:", error);
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadEncryptedFile({
        files: [file],
        tokenId,
        contractAddress,
      });
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleUpload}
        // accept everything
        accept={acceptMimeType ?? "*"}
        className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl"
      />
    </>
  );
};
