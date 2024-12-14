import { LPACC_EVM_CONTRACT } from "./types";
import {
  //   AuthSig,
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitNetwork } from "@lit-protocol/constants";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions, AccsEVMParams, EncryptToJsonPayload } from "@lit-protocol/types";
import { config } from "dotenv";
import { ethers } from "ethers";

config();

export class Lit {
  contractAddress: string;
  litNodeClient: LitJsSdk.LitNodeClient;
  chain;
  tokenId: number | undefined;
  constructor(chain: string, tokenId?: number, contractAddress?: string) {
    this.chain = chain;
    this.litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: LitNetwork.DatilDev,
    });
    this.litNodeClient.disconnect();
    this.tokenId = tokenId;
    this.contractAddress = contractAddress ?? "";
  }

  private accessControlConditions(): AccsEVMParams[] | LPACC_EVM_CONTRACT[] {
    return [
      {
        contractAddress: this.contractAddress,
        chain: this.chain as LPACC_EVM_CONTRACT["chain"],
        functionName: "hasAccess",
        functionParams: [this.tokenId?.toString() ?? "", ":userAddress"],
        functionAbi: {
          name: "hasAccess",
          stateMutability: "view",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
            },
            {
              name: "account",
              type: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
        },
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];
  }

  async connect() {
    await this.litNodeClient.disconnect();
    const res = await this.litNodeClient.connect();
    return res;
  }

  async encryptNFT({ message, file }: { message?: string; file?: File }) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    if (!message && !file) {
      throw new Error("Either message or file must be provided");
    }
    if (File) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.accessControlConditions(),
        file: file,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else if (message) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.accessControlConditions(),
        string: message,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else {
      throw new Error("Either message or file must be provided");
    }
  }

  async encrypt(message?: string, file?: File) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    if (!message && !file) {
      throw new Error("Either message or file must be provided");
    }
    if (File) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        evmContractConditions: this.accessControlConditions() as AccessControlConditions,
        file: file,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    } else if (message) {
      // Encrypt the message
      const encryptedString = await LitJsSdk.encryptToJson({
        // evmContractConditions: this.accessControlConditions(),
        evmContractConditions: this.accessControlConditions() as AccessControlConditions,
        string: message,
        chain: this.chain,
        litNodeClient: this.litNodeClient,
      });

      // Return the ciphertext and dataToEncryptHash
      return {
        jsonPayload: JSON.parse(encryptedString) as EncryptToJsonPayload,
      };
    }
  }

  async decrypt(
    payload: EncryptToJsonPayload,
    // sessionSigs: SessionSigsMap,
    // authSig?: AuthSig,
  ) {
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();
    const sessionSignatures = await this.getSessionSignatures();
    // Get the session signatures
    // Decrypt the message
    try {
      const decryptedString = await LitJsSdk.decryptFromJson({
        parsedJsonData: payload,
        sessionSigs: sessionSignatures,
        litNodeClient: this.litNodeClient,
      });

      // Return the decrypted string
      return { decryptedString } as {
        decryptedString: string | File | Blob;
      };
    } catch (e) {
      console.error(e);
    }
  }

  async getSessionSignaturesByDelegation() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    const res = await fetch("/api/lit", {
      method: "POST",
      body: JSON.stringify({ delegateToAddress: walletAddress }),
    });
    const sessionSigs = await res.json();
    console.log(sessionSigs);
    return sessionSigs;
  }
  async getSessionSignatures() {
    // authSig: AuthSig
    await this.litNodeClient.disconnect();
    await this.litNodeClient.connect();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const ethersSigner = provider.getSigner();
    const walletAddress = await ethersSigner.getAddress();
    const sessionSignatures = await this.litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
      // capabilityAuthSigs: [authSig], // Unnecessary on datil-dev
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress,
          nonce: await this.litNodeClient.getLatestBlockhash(),
          litNodeClient: this.litNodeClient,
        });

        return await generateAuthSig({
          signer: ethersSigner,
          toSign,
        });
      },
    });
    return sessionSignatures;
  }
}
