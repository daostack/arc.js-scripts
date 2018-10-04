import {
  Web3,
  Utils,
  Address
} from "@daostack/arc.js";
import { Common } from './common';

/**
 * Instantiate a contract given the json specification for it. 
 * Logs the resulting address to the console.
 * 
 * The spec should look like this
 * ```
 * {
 *   name: "arcContractName",
 *   constructorParams: [value1, value2, value3, .... ],
 *   initializeParams: []
 * }
 * ```
 * 
 * `constructorParams` can be omitted if there are no params
 * `initializeParams` is only for contracts that have an `initialize` method after being constructed
 * 
 * @param web3 
 * @param networkName 
 * @param jsonSpecPath
 * @param gas optional gas amount.  if set to "max" then will use a high limit close to the current block limit
 */
export const run = async (
  web3: Web3,
  networkName: string,
  jsonSpecPath: string | object,
  isRawJson: string = "false",
  gas?: string
): Promise<{ address: Address }> => {

  if (!jsonSpecPath) {
    throw new Error("jsonSpecPath was not supplied");
  }

  const spec = Common.isTruthy(isRawJson) ? jsonSpecPath : require(jsonSpecPath as string);

  if (!spec.name) {
    throw new Error("contract name was not supplied");
  }

  const params = spec.constructorParams || [];

  if (gas) {
    if (gas = "max") {
      gas = (await Common.computeMaxGasLimit(web3)).toString();
    }
    params.push({ gas: Number.parseInt(gas) })
  }

  let truffleContract;
  try {
    truffleContract = await Utils.requireContract(spec.name);
  } catch (ex) {
    throw new Error(`can't find '${spec.name}': ${ex.message ? ex.message : ex}`);
  }

  console.log(`instantiating ${spec.name}`);

  const newContract = await truffleContract.new(...params);

  console.log(`new ${spec.name} address: ${newContract.address} `);

  const initializeParams = spec.initializeParams || [];

  if (initializeParams.length) {
    console.log(`initializing ${spec.name}`);
    await newContract.initialize(...initializeParams);
  }


  return Promise.resolve(newContract);
}
