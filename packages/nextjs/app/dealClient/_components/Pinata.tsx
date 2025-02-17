"use server";

export type PinataResponse = {
  ipfsHash: string;
  pinSize: number;
  timeStamp: string;
  isDuplicate: boolean;
};

export async function uploadToIPFS(data: FormData): Promise<PinataResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload to IPFS: ${res.statusText}`);
    }

    const resData = await res.json();

    const ipfsHash = resData?.IpfsHash;
    const pinSize = resData?.pinSize;
    const timeStamp = resData?.timeStamp;
    const isDuplicate = resData?.isDuplicate;

    return { ipfsHash, pinSize, timeStamp, isDuplicate };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}