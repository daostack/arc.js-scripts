import {
  InitializeArcJs,
  LoggingService,
  LogLevel,
  Web3,
  Utils
} from "@daostack/arc.js";

/**
 * Instantiate a contract given the json specification for it.
 * Logs the resulting address to the console.
 * 
 * The spec should look like this
 * ```
 * {
 *   name: "arcContractName",
 *   constructorParams: [value1, value2, value3, .... ]
 * }
 * ```
 * 
 * `constructorParams` can be omitted if there are no params
 * 
 * @param web3 
 * @param networkName 
 */
export const run = async (
  web3: Web3,
  networkName: string,
  jsonSpecPath: string
): Promise<void> => {

  if (!jsonSpecPath) {
    throw new Error("jsonSpecPath was not supplied");
  }

  const spec = require(jsonSpecPath);

  if (!spec.name) {
    throw new Error("contract name was not supplied");
  }

  const params = spec.constructorParams || [];

  let truffleContract;
  try {
    truffleContract = await Utils.requireContract(spec.name);
  } catch (ex) {
    throw new Error(`can't find '${spec.name}': ${ex.message ? ex.message : ex}`);
  }

  console.log(`instantiating ${spec.name} with ${params}`);

  const newContract = await truffleContract.new(...params);

  console.log(`new ${spec.name} address: ${newContract.address} `);

  return Promise.resolve();
}
