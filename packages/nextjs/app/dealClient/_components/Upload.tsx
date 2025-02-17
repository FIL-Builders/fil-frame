import React, { useState } from "react";
import { uploadToIPFS } from "./Pinata";
import { ethers } from "ethers";
import { CommP } from "@web3-storage/data-segment";
import { importer } from 'ipfs-unixfs-importer';
import { base32 } from 'multiformats/bases/base32';
import { CID } from "multiformats/cid";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { onRampContractAbi } from "~~/contracts/generated";


const PINATA_CONFIGS = JSON.stringify({
  cidVersion: 1,
});
const PINATA_CLOUD_ROOT = "https://gateway.pinata.cloud/ipfs/";
const ONRAMP_CONTRACT_ADDRESS_SRC_CHAIN = "0xACd64568CDDdF173d65ED6d3B304ad17E98Cca2F";
const WETH_ADDRESS = "0xb44cc5FB8CfEdE63ce1758CE0CDe0958A7702a16";

export const GetFileDealParams = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [pieceSize, setPieceSize] = useState<number | null>(null);
  const [pieceCID, setPieceCID] = useState<any | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [cid, setCid] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);

    const file = event.target.files?.[0];
    if (file) {
      const uploadedFile = await uploadFile(file);
      setPieceSize(uploadedFile.pieceSize);
      setPieceCID(uploadedFile.pieceCID);
      setIpfsUrl(uploadedFile.ipfsUrl);
      setCid(uploadedFile.cid);
      console.log("File uploaded successfully, params are: ", uploadedFile);

      setIsUploading(false);
      return uploadedFile;
    }
    setIsUploading(false);
  };

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async () => {
    if (!pieceSize || !pieceCID || !ipfsUrl || !cid) {
      console.error("Missing required data for the offer:", { pieceSize, pieceCID, ipfsUrl, cid });
      return;
    }

    console.log("IPFS CID is:", cid);
    console.log("pieceCID is:", pieceCID.toString());
    console.log("pieceSize", pieceSize);
    console.log("ipfsUrl", ipfsUrl);

    const pieceCidBytes = ethers.utils.hexlify(pieceCID.bytes);

    const offer = {
      commP: pieceCidBytes as `0x${string}`,
      size: BigInt(pieceSize),
      cid: cid,
      location: ipfsUrl,
      amount: BigInt(0),
      token: WETH_ADDRESS as `0x${string}`,
    };

    try {
      writeContract({
        address: ONRAMP_CONTRACT_ADDRESS_SRC_CHAIN,
        abi: onRampContractAbi,
        functionName: "offerData",
        args: [offer],
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={handleUpload}
        accept={"*"}
        className="file-input border-base-300 border shadow-md shadow-secondary rounded-3xl"
      />
      <button onClick={handleSubmit} disabled={isUploading}>{isUploading ? "Uploading..." : "Summit"}</button>
      {isPending && <div>Transaction pending...</div>}
      {isConfirming && <div>Confirming transaction...</div>}
      {isConfirmed && <div>Transaction confirmed!</div>}
      {isConfirmed && hash && <div>Transaction hash: {hash}</div>}
    </>
  );
};

async function uploadFile(file: File) {
  try {
    const data = new FormData();
    data.append("file", file);
    data.append("pinataOptions", PINATA_CONFIGS);

    const response = await uploadToIPFS(data);

    const fileIPFSHash = response?.ipfsHash;
    const ipfsURL = `${PINATA_CLOUD_ROOT}${fileIPFSHash}`;

    const cid = await generateCID(file);

    const commP = await generateCommP(file);
    const pieceSize = commP.pieceSize;
    const commPCID = commP.link();

    if (!cid) {
      throw new Error("CID is undefined");
    }

    return { pieceSize, cid: cid.toString(), pieceCID: commPCID, ipfsUrl: ipfsURL };
  } catch (error) {
    console.error("Error creating CAR file:", error);
    throw error;
  }
}

// Generate a CID using sha256
async function generateCID(file: File): Promise<CID> {
  try {
    const blockstore = {
      store: new Map<string, Uint8Array>(),
      async put(cid: CID, bytes: Uint8Array) {
        this.store.set(cid.toString(), bytes);
        return cid;
      },
      async get(cid: CID) {
        return this.store.get(cid.toString());
      },
    };

    const options = {
      maxChunkSize: 262144, // 256 KB chunk size
      rawLeaves: true, // Use DAG-PB encoding (not raw leaves)
    };

    const fileContents = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileContents);

    const source = [{ content: uint8Array }]; // Use Uint8Array instead of ReadableStream

    for await (const file of importer(source, blockstore, options)) {
      console.log("Generated CID:", file.cid.toString(base32));
      return file.cid;
    }

    throw new Error("No CID was generated for the file.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error replicating IPFS add:", error.message);
    } else {
      console.error("Unknown error replicating IPFS add");
    }
    throw error; // Re-throw the error to handle it in the calling function
  }
}

async function generateCommP(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const commP = await CommP.build(bytes);
  return commP;
}