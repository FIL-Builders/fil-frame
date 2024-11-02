import { accessControlConditions } from "~~/hooks/lighthouse/types";
import { useLighthouseEncryptedFilesUpload, useLighthouseFilesUpload } from "~~/hooks/lighthouse/useUpload";


type DealParams = { 
  location_ref: string;
  piece_cid: string;
  piece_size: number;
  car_size: number;
  label: string;
}
export const LighthouseFileUpload = ({
  handleGetDealParams,
  acceptMimeType,
}: {
  handleGetDealParams: (params:DealParams) => void;
  acceptMimeType?: string;
}) => {
  const uploadFile = useLighthouseFilesUpload({
    onUploadSuccess: async(cid: string, files?: File[]) => {
      const params = await getFileDealParams(cid || "", files ? files[0] : undefined);
      handleGetDealParams(params);
    },
    onUploadError: (error: any) => {
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
    onUploadSuccess: (cid: string, files?: File[]) => {
      handleGetCID(cid);
    },
    onUploadError: (error: any) => {
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

export const getFileDealParams = async (cid: string, file?: File) => {
  return {
    piece_cid: "0x0000",
    piece_size: file?.size,
    location_ref: cid,
    car_size: file?.size,
    label: file?.name,
  } as DealParams;
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
    onUploadSuccess: (cid: string) => {
      handleGetCID(cid);
    },
    onUploadError: (error: any) => {
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
    onUploadSuccess: (cid: string) => {
      handleGetCID(cid);
    },
    onUploadError: (error: any) => {
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
