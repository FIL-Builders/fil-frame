import fs from "fs";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

interface VerifyContractParams {
  contractName: string;
}

interface SourceFile {
  content: string;
}

interface SolhintData {
  language: string;
  sources: Record<string, SourceFile>;
  settings: {
    optimizer: {
      enabled: boolean;
      runs: number;
    };
  };
}

interface DeploymentData {
  address: string;
  solcInputHash: string;
  metadata: string;
}

task("verify-contract", "Verifies a contract on Filfox")
  .addParam("contractName", "The name of the contract to verify")
  .setAction(
    async (taskArgs: VerifyContractParams, hre: HardhatRuntimeEnvironment) => {
      const networkName = hre.network.name;

      const { contractName } = taskArgs;

      const verificationData = extractVerificationData(
        networkName,
        contractName
      );
      const url =
        networkName === "calibration"
          ? "https://calibration.filfox.info/api/v1/tools/verifyContract"
          : "https://filfox.info/api/v1/tools/verifyContract";
      const headers = {
        "Content-Type": "application/json",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(verificationData),
        });

        const result = await response.json();

        handleVerificationResult({
          result,
          network: networkName,
          address: verificationData.address,
        });
      } catch (error: any) {
        console.error("⚠️ Error verifying contract: ", error.cause);
        console.log(
          "Please contact us on [Telegram](https://t.me/Filfoxofficial) if you encounter this error."
        );
      }
    }
  );

function extractVerificationData(network: string, contractName: string) {
  const customNetworks = ["calibration", "filecoin"];
  if (!customNetworks.includes(network)) {
    throw new Error(
      "Use regular hardhat verification for networks other than calibration and filecoin"
    );
  }

  const deploymentsPath = `./deployments/${network}/${contractName}.json`;
  const deployments: DeploymentData = JSON.parse(
    fs.readFileSync(deploymentsPath, "utf8")
  );

  const solhintPath = `./deployments/${network}/solcInputs/${deployments.solcInputHash}.json`;
  const solhint: SolhintData = JSON.parse(fs.readFileSync(solhintPath, "utf8"));
  // Extract the necessary data from the deployments and solhint files
  let sourceFiles = Object.keys(solhint.sources).reduce(
    (acc: any, key: string) => {
      acc[key] = solhint.sources[key]; // Add other sources

      return acc;
    }, {});

  const contractToVerify = Object.keys(sourceFiles).find((key) =>
    key.includes(contractName + ".sol")
  );
  if (!contractToVerify) {
    throw new Error(
      `Contract ${contractName} not found in the sources provided.`
    );
  }
  // Ensure the contract source is the first entry
  const contractSource = sourceFiles[contractToVerify];
  delete sourceFiles[contractToVerify]; // Remove it from its current position
  sourceFiles = { [contractToVerify]: contractSource, ...sourceFiles }; // Add it back at the start

  const { compiler, language } = JSON.parse(deployments.metadata) as {
    compiler: {
      version: string;
    };
    language: string;
    output: {
      abi: any[];
      devdoc: any;
      userdoc: any;
    };
  };
  const compilerVersion = "v" + compiler.version;
  const optimize = solhint.settings.optimizer.enabled;
  const optimizeRuns = solhint.settings.optimizer.runs;
  const license = "";
  const evmVersion = "default";
  const viaIR = false;
  const libraries = "";
  const metadata = "";

  return {
    address: deployments.address,
    language,
    compiler: compilerVersion,
    optimize,
    optimizeRuns,
    sourceFiles,
    license,
    evmVersion,
    viaIR,
    libraries,
    metadata,
    optimizerDetails: "",
  };
}

function handleVerificationResult({
  result,
  network,
  address,
}: {
  result: any;
  network: string;
  address: string;
}) {
  const explorerUrls = {
    calibration: "https://calibration.filfox.info/en/address/",
    filecoin: "https://filfox.info/en/address/",
  };

  const explorerUrl = explorerUrls[network as keyof typeof explorerUrls];

  switch (result.errorCode) {
    case 0:
      console.log(`✅ Your contract "${result.contractName}" is now verified.`);
      console.log("Check it out at: ");
      console.log(`${explorerUrl}${address}`);
      break;

    case 1:
      console.log("⚠️ Error: No source file was provided.");
      break;

    case 2:
      console.log("⚠️ Error: Contract initCode not found.");
      console.log(
        "Please contact us on [Telegram](https://t.me/Filfoxofficial) if you encounter this error."
      );
      break;

    case 3:
      console.log("⚠️ Error: Load remote compiler failed.");
      console.log("The compiler version string must be in the long format.");
      console.log("For example, use v0.7.6+commit.7338295f instead of v0.7.6.");
      console.log("Please try again later with the correct compiler version.");
      break;

    case 4:
      console.log(
        `⚠️ Error: Verify failed for contract "${result.contractName}".`
      );
      console.log("Compiled bytecode doesn't match the contract's initCode.");
      console.log(
        "Please make sure all source files and compiler configurations are correct."
      );
      break;

    case 5:
      console.log("⚠️ Error: Unsupported language.");
      console.log("Only Solidity is supported for now.");
      break;

    case 6:
      console.log("ℹ️ Your contract is already verified.");
      console.log("Check it out at:\n", `${explorerUrl}${address}`);
      break;

    case 7:
      console.log(
        "⚠️ Compilation error: Something is wrong with your source files."
      );
      console.log(`Error message: ${result.errorMsg}`);
      console.log("Please fix the issue and try again.");
      break;

    default:
      console.log("⚠️ Unknown error occurred during verification.");
      break;
  }
}
