import { AbiFunction } from "viem";
import { DealInfoData } from "~~/hooks/lighthouse/useUpload";

export const makeDealFunction: AbiFunction = {
  inputs: [
    {
      components: [
        {
          internalType: "bytes",
          name: "piece_cid",
          type: "bytes",
        },
        {
          internalType: "uint64",
          name: "piece_size",
          type: "uint64",
        },
        {
          internalType: "bool",
          name: "verified_deal",
          type: "bool",
        },
        {
          internalType: "string",
          name: "label",
          type: "string",
        },
        {
          internalType: "int64",
          name: "start_epoch",
          type: "int64",
        },
        {
          internalType: "int64",
          name: "end_epoch",
          type: "int64",
        },
        {
          internalType: "uint256",
          name: "storage_price_per_epoch",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "provider_collateral",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "client_collateral",
          type: "uint256",
        },
        {
          internalType: "uint64",
          name: "extra_params_version",
          type: "uint64",
        },
        {
          components: [
            {
              internalType: "string",
              name: "location_ref",
              type: "string",
            },
            {
              internalType: "uint64",
              name: "car_size",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "skip_ipni_announce",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "remove_unsealed_copy",
              type: "bool",
            },
          ],
          internalType: "struct ExtraParamsV1",
          name: "extra_params",
          type: "tuple",
        },
      ],
      internalType: "struct DealRequest",
      name: "deal",
      type: "tuple",
    },
  ],
  name: "makeDealProposal",
  outputs: [
    {
      internalType: "bytes32",
      name: "",
      type: "bytes32",
    },
  ],
  stateMutability: "nonpayable",
  type: "function",
};

export interface DealInputs {
  piece_cid: string;
  piece_size: number;
  verified_deal: boolean;
  label: string;
  start_epoch: number;
  end_epoch: number;
  storage_price_per_epoch: number;
  provider_collateral: number;
  client_collateral: number;
  extra_params_version: number;
  location_ref: string;
  car_size: number;
  skip_ipni_announce: boolean;
  remove_unsealed_copy: boolean;
}

export function createDealObject({
  piece_cid,
  piece_size,
  verified_deal,
  label,
  start_epoch,
  end_epoch,
  storage_price_per_epoch,
  provider_collateral,
  client_collateral,
  extra_params_version,
  location_ref,
  car_size,
  skip_ipni_announce,
  remove_unsealed_copy,
}: DealInputs) {
  return {
    piece_cid: piece_cid,
    piece_size: piece_size,
    verified_deal: verified_deal,
    label: label,
    start_epoch: start_epoch,
    end_epoch: end_epoch,
    storage_price_per_epoch: storage_price_per_epoch,
    provider_collateral: provider_collateral,
    client_collateral: client_collateral,
    extra_params_version: extra_params_version,
    extra_params: {
      location_ref: location_ref,
      car_size: car_size,
      skip_ipni_announce: skip_ipni_announce,
      remove_unsealed_copy: remove_unsealed_copy,
    },
  };
}

export const getDefaultDealInputs = (dealParams?: DealInfoData) => {
  return {
    piece_cid: dealParams?.pieceCid ?? "0x00",
    piece_size: dealParams?.pieceSize ?? 0,
    verified_deal: true,
    label: "",
    start_epoch: dealParams?.dealStartBlock ?? 0,
    end_epoch: dealParams?.dealEndBlock ?? 0,
    storage_price_per_epoch: 0,
    provider_collateral: 0,
    client_collateral: 0,
    extra_params_version: 1,
    location_ref: dealParams?.carLink ?? "",
    car_size: dealParams?.carSize ?? 0,
    skip_ipni_announce: false,
    remove_unsealed_copy: false,
  };
};
