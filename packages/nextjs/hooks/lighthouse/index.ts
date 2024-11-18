import { generate, recoverKey, recoverShards, saveShards } from "@lighthouse-web3/kavach";
import lighthouse from "@lighthouse-web3/sdk";

type accessControlConditions = any;

export const uploadFilesEncrypted = async (
  files: File[],
  apiKey: string,
  userAddress: string,
  jwt: string,
  conditions?: accessControlConditions[],
  aggregator?: string,
) => {
  let cid = await _uploadFilesEncrypted(files, apiKey, userAddress, jwt);
  if (conditions?.length === 0 || !conditions || !aggregator) {
    return cid;
  }
  cid = await applyAccessConditions(cid, userAddress, jwt, conditions, aggregator);
  return cid;
};

export const uploadFiles = async (files: File[], apiKey: string) => {
  const output = await lighthouse.upload(files, apiKey);
  return output.data.Hash;
};

/* Deploy file along with encryption */
export const _uploadFilesEncrypted = async (files: File[], apiKey: string, userAddress: string, jwt: string) => {
  const output = await lighthouse.uploadEncrypted(files, apiKey, userAddress, jwt);
  console.log("output", output.data[0].Hash);

  const { keyShards } = await generate();

  await saveShards(userAddress, output.data[0].Hash, jwt, keyShards);

  return output.data[0].Hash;
};

export const decrypt = async (cid: string, userAddress: string, jwt: string) => {
  let decrypted;
  const { shards } = await recoverShards(userAddress, cid, jwt, 3);
  try {
    const { masterKey } = await recoverKey(shards);
    decrypted = await lighthouse.decryptFile(cid, masterKey);
  } catch {}
  return decrypted;
};

export const applyAccessConditions = async (
  cid: string,
  address: string,
  jwt: string,
  conditions: accessControlConditions[],
  aggregator: string,
) => {
  const response = await lighthouse.applyAccessCondition(address, cid, jwt, conditions, aggregator);
  return response.data.cid;
};
