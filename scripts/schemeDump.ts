import {
  InitializeArcJs,
  LoggingService,
  LogLevel,
  DAO,
  Web3,
  Address,
  USchemeWrapperBase
} from "@daostack/arc.js";
import { BigNumber } from '../node_modules/bignumber.js';

/**
 * Output info about a universal scheme given avatar and scheme name
 * @param web3 
 * @param networkName 
 * @param avatar 
 */
export const run = async (web3: Web3, networkName: string, avatar: Address, schemeName: string): Promise<void> => {

  if (!avatar) {
    return Promise.reject("avatar was not supplied")
  }

  if (!schemeName) {
    return Promise.reject("scheme name was not supplied")
  }

  LoggingService.logLevel = LogLevel.info | LogLevel.error;

  await InitializeArcJs();

  const dao: DAO = await DAO.at(avatar);

  const schemes = await dao.getSchemes(schemeName);

  if (schemes.length !== 1) {
    return Promise.reject(`number of schemes ${schemes.length} is not one`);
  }

  const schemeInfo = schemes[0];

  if (!schemeInfo.wrapper) {
    return Promise.reject(`requested scheme is not a scheme`);
  }

  const wrapper = schemeInfo.wrapper as USchemeWrapperBase;

  console.log(`address: ${wrapper.address}`);
  const params = await wrapper.getSchemeParameters(avatar);
  console.log(`parameters:`);
  console.dir(params);
  const perms = await wrapper.getSchemePermissions(avatar);
  console.log(`permissions: ${perms}`);

  return Promise.resolve();
}
