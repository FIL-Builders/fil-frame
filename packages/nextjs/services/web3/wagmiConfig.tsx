import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import { getAlchemyHttpUrl } from "@utils/networks";

import * as Constants from "@common/constants";

const { targetNetworks } = Constants;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = (
  targetNetworks.find((network: Chain) => network.id === 1)
    ? targetNetworks
    : [mainnet, ...targetNetworks]
) as [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getAlchemyHttpUrl(chain.id)),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: Constants.pollingInterval,
          }
        : {}),
    });
  },
});
