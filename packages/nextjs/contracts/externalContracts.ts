import { GenericContractsDeclaration } from "~~/utils/fil-frame/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {} as const;

export default externalContracts satisfies GenericContractsDeclaration;
