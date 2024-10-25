export type accessControlConditions = {
  id: number;
  chain: string;
  method: string;
  standardContractType: string;
  contractAddress: string;
  returnValueTest: {
    comparator: string;
    value: string;
  };
  parameters: string[];
  inputArrayType?: string[];
  outputType?: string;
};
