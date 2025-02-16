import { useEffect, useState } from "react";
import Image from "next/image";
import { Abi, Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { getIpfsGatewayUri } from "~~/hooks/lighthouse/utils";
import { notification } from "~~/utils/fil-frame";
import { useAllContracts } from "~~/utils/fil-frame/contractsData";

export const DealsGalery = () => {
  const contractsData = useAllContracts();
  const dealClient = contractsData["DealClient"];
  const DealClientAddress = dealClient.address;
  const DealClientAbi = dealClient.abi;
  const publicClient = usePublicClient();
  const deals: any[] = [];
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
      {deals.map(deal => (
        <DealItem dealData={deal} DealClientAddress={DealClientAddress} lighthouseNFTAbi={DealClientAbi} />
      ))}
    </div>
  );
};

export default DealsGalery;

const DealItem = ({
  dealData,
  DealClientAddress,
  lighthouseNFTAbi,
}: {
  dealData?: any;
  DealClientAddress: Address;
  lighthouseNFTAbi: Abi;
}) => {
  return (
    <div className="flex flex-col items-center bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl p-1">
      <p className="text-center mt-2"></p>
    </div>
  );
};
