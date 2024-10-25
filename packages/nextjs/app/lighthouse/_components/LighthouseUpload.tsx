import { accessControlConditions } from "~~/hooks/lighthouse/types";
import { useLighthouseEncryptedFilesUpload, useLighthouseFilesUpload } from "~~/hooks/lighthouse/useUpload";

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

export const LigthouseEnctyptedFileUpload = ({
  handleGetCID,
  acceptMimeType,
  accessControlConditions,
}: {
  handleGetCID: (cid: string) => void;
  acceptMimeType?: string;
  accessControlConditions: {
    conditions: accessControlConditions[];
    aggregate: string;
  };
}) => {
  const uploadEncryptedFile = useLighthouseEncryptedFilesUpload({
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
      await uploadEncryptedFile([file], accessControlConditions);
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

export const LighthouseEncryptedFolderUpload = ({
  handleGetCID,
  acceptMimeType,
  accessControlConditions,
}: {
  handleGetCID: (cid: string) => void;
  acceptMimeType?: string;
  accessControlConditions: {
    conditions: accessControlConditions[];
    aggregate: string;
  };
}) => {
  const uploadEncryptedFiles = useLighthouseEncryptedFilesUpload({
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
      await uploadEncryptedFiles(files, accessControlConditions);
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
