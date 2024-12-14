import { Lit } from "../lit/utils";
import { getIpfsGatewayUri } from "./utils";
import { EncryptToJsonPayload } from "@lit-protocol/types";
import { useMutation } from "@tanstack/react-query";

export const fetchIPFS = async (cid: string) => {
  const res = await fetch(getIpfsGatewayUri(cid));
  const data = await res.json();
  return data;
};

export const useDecryptFile = () => {
  return useMutation({
    mutationFn: async ({ cid, litChain }: { cid: string; litChain: string }) => {
      const lit = new Lit(litChain);

      const data = (await fetchIPFS(cid)) as EncryptToJsonPayload;

      const blob = await lit.decrypt(data);
      return blob?.decryptedString;
    },
  });
};
