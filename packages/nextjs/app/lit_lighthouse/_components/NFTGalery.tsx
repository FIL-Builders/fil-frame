import { useEffect, useState } from "react";
import Image from "next/image";
import { useFetchTokensData, useGetHasAccess } from "../utils";
import { Abi, Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useDecryptFile } from "~~/hooks/lighthouse/useDecrypt";
import { getIpfsGatewayUri } from "~~/hooks/lighthouse/utils";
import { chainIdToLitNetwork } from "~~/hooks/lit/types";
import { notification } from "~~/utils/fil-frame";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const NFTGallery = () => {
  const contractsData = useAllContracts();
  const litEncryptedNFT = contractsData["LitEncryptedNFT"];
  const litEncryptedNFTAddress = litEncryptedNFT.address;
  const litEncryptedNFTAbi = litEncryptedNFT.abi;
  const publicClient = usePublicClient();
  const { tokensData, tokenIdsArray } = useFetchTokensData(litEncryptedNFTAddress, litEncryptedNFTAbi, publicClient);

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
      {tokenIdsArray.map(tokenId => (
        <NFTItem
          key={tokenId}
          tokenId={tokenId}
          tokenData={tokensData?.get(tokenId)}
          litEncryptedNFTAddress={litEncryptedNFTAddress}
          litEncryptedNFTAbi={litEncryptedNFTAbi}
        />
      ))}
    </div>
  );
};

export default NFTGallery;

const NFTItem = ({
  tokenId,
  tokenData,
  litEncryptedNFTAddress,
  litEncryptedNFTAbi,
}: {
  tokenId: number;
  tokenData?: { isOpen: boolean; cid: string };
  litEncryptedNFTAddress: Address;
  litEncryptedNFTAbi: Abi;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasContentAccess, setHasContentAccess] = useState(false);
  const { mutateAsync: hasAccess } = useGetHasAccess();
  const { mutateAsync: decrypt } = useDecryptFile();

  const { address, chainId } = useAccount();

  useEffect(() => {
    const checkAccess = async () => {
      if (tokenData && !tokenData.isOpen) {
        const access = (await hasAccess({
          tokenId: BigInt(tokenId),
          nftContractAddress: litEncryptedNFTAddress,
          ntfContractAbi: litEncryptedNFTAbi,
        })) as boolean;
        setHasContentAccess(access);
        setAccessChecked(true);
      }
    };
    checkAccess();
  }, [tokenData, hasAccess, tokenId, litEncryptedNFTAddress, litEncryptedNFTAbi, address]);

  const handleDecrypt = async () => {
    if (tokenData && hasContentAccess) {
      const chain = chainIdToLitNetwork[chainId as number];
      const notificationId = notification.loading("Decrypting NFT...");
      const blob = (await decrypt({ cid: tokenData.cid, litChain: chain })) as Blob;
      const ImageFile = new File([blob], `NFT_${tokenId}.png`, { type: "image/png" });
      notification.remove(notificationId);
      notification.success("NFT decrypted successfully!");
      setImage(ImageFile);
    }
  };

  return (
    <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-1">
      <p className="text-center mt-2">NFT #{tokenId}</p>
      {tokenData?.isOpen ? (
        <Image
          src={getIpfsGatewayUri(tokenData.cid)}
          alt={`NFT ${tokenId}`}
          width={200}
          height={200}
          className="rounded-lg"
        />
      ) : image ? (
        <Image
          src={URL.createObjectURL(image as Blob)}
          alt={`NFT ${tokenId}`}
          width={200}
          height={200}
          className="rounded-lg"
        />
      ) : accessChecked ? (
        hasContentAccess ? (
          <button onClick={handleDecrypt} className="btn btn-primary mt-2">
            Decrypt
          </button>
        ) : (
          <p className="text-center mt-2">No Decrypt Access</p>
        )
      ) : (
        <p className="text-center mt-2">Checking Decrypt Access...</p>
      )}
    </div>
  );
};
