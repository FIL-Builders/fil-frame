import { useEffect, useState } from "react";
import { TransactionBase, TransactionReceipt } from "viem";

type DataProps =
  | string
  | number
  | bigint
  | Record<string, any>
  | TransactionBase
  | TransactionReceipt
  | undefined
  | unknown;

const ANIMATION_TIME = 2000;

export function useAnimationConfig(data: DataProps | DataProps[]) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevData, setPrevData] = useState<DataProps | DataProps[]>();

  useEffect(() => {
    if (prevData !== undefined && prevData !== data) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), ANIMATION_TIME);
    }
    setPrevData(data);
  }, [data, prevData]);

  return {
    showAnimation,
  };
}
