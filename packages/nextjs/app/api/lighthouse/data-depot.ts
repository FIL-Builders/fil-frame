// utils/data-depot.ts
import lighthouse from "@lighthouse-web3/sdk";
import fs from "fs";
import path from "path";
const dataDepotUrl = "https://data-depot.lighthouse.storage";

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.promises.unlink(filePath);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

interface FileParam {
  id: string;
  fileName: string;
  carSize: number;
  payloadCid: string;
  pieceCid: string;
  pieceSize: number;
  mimeType: string;
}

export const uploadToLighthouseDataDepot = async (
  file: File,
  apiKey: string,
): Promise<{
  carLink: string;
  carSize: number;
  pieceCid: string;
  pieceSize: number;
  mimeType: string;
}> => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const authToken = await lighthouse.dataDepotAuth(apiKey);
    let response = await lighthouse.viewCarFiles(1, authToken.data.access_token);
    let fileParams: FileParam[] = response.data.filter((item: any) => item.fileName === file.name);

    if (!fileParams.length) {
      await lighthouse.createCar(filePath, authToken.data.access_token);

      for (let i = 0; i < 180; i++) {
        response = await lighthouse.viewCarFiles(1, authToken.data.access_token);
        fileParams = response.data.filter((item: any) => item.fileName === file.name);

        if (fileParams.length && fileParams[0].pieceCid) {
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (fileParams.length === 0 || !fileParams[0].pieceCid) {
      throw new Error("Failed to upload file to Lighthouse Data Depot.");
    }

    const carLink = `${dataDepotUrl}/api/download/download_car?fileId=${fileParams[0].id}.car`;
    const pieceData = {
      carLink,
      carSize: fileParams[0].carSize,
      pieceCid: fileParams[0].pieceCid,
      pieceSize: fileParams[0].pieceSize,
      mimeType: fileParams[0].mimeType,
    };

    await deleteFile(filePath);
    return pieceData;
  } catch (err) {
    console.error(err);
    throw new Error("Upload failed");
  }
};
