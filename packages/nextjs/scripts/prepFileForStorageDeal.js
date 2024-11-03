import { packToFs } from "ipfs-car/pack/fs";
import { Web3Storage, getFilesFromPath } from "web3.storage";

const FILE_PATH = "./path/to/your/file.txt";
const API_TOKEN = process.env.WEB3_STORAGE_API_TOKEN;

async function prepFileForStorageDeal() {
  try {
    // Step 1: Generate the .car file
    const carFilePath = "./file.car";
    await packToFs({
      input: FILE_PATH,
      output: carFilePath,
    });

    console.log(`.car file created at ${carFilePath}`);

    // Step 2: Upload to IPFS using Web3.Storage
    const storage = new Web3Storage({ token: API_TOKEN });
    const files = await getFilesFromPath(carFilePath);
    const cid = await storage.put(files);

    console.log("Upload complete");
    console.log("CID:", cid);
    console.log("IPFS Gateway URL:", `https://w3s.link/ipfs/${cid}`);

    return {
      cid,
      carFilePath,
      ipfsUrl: `https://w3s.link/ipfs/${cid}`,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
  }
}

// Execute the upload function
prepFileForStorageDeal();
