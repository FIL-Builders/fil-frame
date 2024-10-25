import { decrypt } from ".";
import { getUserJWT } from "./utils";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";

export const useDecryptFile = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  return useMutation({
    mutationFn: async ({ cid }: { cid: string }) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not found");
      }
      const jwt = await getUserJWT(address, walletClient);
      if (!jwt) {
        throw new Error("Error signing in to Lighthouse");
      }
      return decrypt(cid, address, jwt);
    },
  });
};