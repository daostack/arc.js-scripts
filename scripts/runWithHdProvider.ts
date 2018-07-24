/* tslint:disable:no-console */
/* tslint:disable:no-var-requires */
import { Web3 } from "web3";
import { Utils } from "@daostack/arc.js";
import { promisify } from 'util';

const usage = (): void => {
  console.log(`usage: 'node runWithProvider.js [providerConfiguration] [script] [method] [optionalParameters]'`);
  console.log(`  providerConfiguration: path to json provider configuration file, or "none"`);
  console.log(`  script: path to javascript script file`);
  console.log(`  method: name of the method to execute`);
};

let provider;

const exit = (code: number = 0): void => {
  if (provider) {
    console.log("stopping provider engine...");
    // see: https://github.com/trufflesuite/truffle-hdwallet-provider/issues/46
    provider.engine.stop();
  }
  process.exit(code);
};

if (process.argv.length < 5) {
  usage();
  exit();
}

const providerConfigPath = process.argv[2];
const script = require(process.argv[3]);
const method = process.argv[4];

const connectToNetwork = async (): Promise<void> => {
  const webConstructor = require("web3");

  let providerConfig;

  console.log(`providerConfig at: ${providerConfigPath}`);
  providerConfig = require(providerConfigPath);

  const HDWalletProvider = require("truffle-hdwallet-provider");
  console.log(`Provider: '${providerConfig.providerUrl}'`);
  console.log(`Account: '${providerConfig.mnemonic}'`);
  provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);
  (global as any).web3 = new webConstructor(provider);
};

try {

  const runScript = async (): Promise<void> => {

    if (providerConfigPath.toLowerCase() !== "none") {
      await connectToNetwork();
    }

    /**
     * Note that if no node is listening at the provider's url, particularly with ganache, this
     * may disappear into la-la land.  In that case web3.net.getListening will not have invoked its
     * given callback, leaving us adrift.
     */
    return Utils.getWeb3()
      .then(async (web3: Web3) => {
        const networkName = await Utils.getNetworkName();
        (global as any).accounts = await promisify(web3.eth.getAccounts)();

        console.log(`Executing ${method}`);

        return script[method](web3, networkName, ...process.argv.slice(5))
          .then(() => {
            console.log(`Completed ${method}`);
            exit();
          })
          .catch((ex: any) => {
            console.log(`Error in ${method}: ${ex}`);
            exit();
          });
      })
      .catch((ex: any) => {
        console.log(`Error: ${ex}`);
        exit();
      });
  };

  runScript();
} catch (ex) {
  console.log(`an error occurred: ${ex}`);
}
