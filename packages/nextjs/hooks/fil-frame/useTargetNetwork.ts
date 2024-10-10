import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/fil-frame";
import { NETWORKS_EXTRA_DATA } from "~~/utils/fil-frame";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== targetNetwork.id) {
      setTargetNetwork(newSelectedNetwork);
    }
  }, [chain?.id, setTargetNetwork, targetNetwork.id]);

  return useMemo(
    () => ({
      targetNetwork: {
        ...targetNetwork,
        ...NETWORKS_EXTRA_DATA[targetNetwork.id],
      },
    }),
    [targetNetwork],
  );
}
