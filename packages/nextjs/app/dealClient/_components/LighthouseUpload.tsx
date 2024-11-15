import { DealInfoData, useLighthouseGetFilecoinDealParams } from "~~/hooks/lighthouse/useUpload";

export const LighthouseGetFileDealParams = ({
  handleGetDealParams,
  dealDurationInMonths,
}: {
  handleGetDealParams: (params: DealInfoData) => void;
  dealDurationInMonths: number;
}) => {
  const uploadFile = useLighthouseGetFilecoinDealParams({
    onUploadSuccess: (dealInfoData: DealInfoData) => {
      handleGetDealParams(dealInfoData);
    },
    onUploadError: (error: any) => {
      console.error("Error uploading file:", error);
    },
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file, dealDurationInMonths);
      event.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleUpload}
        // accept everything
        accept={"*"}
        className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl"
      />
    </>
  );
};
