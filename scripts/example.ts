import {
  InitializeArcJs,
  LoggingService,
  LogLevel
} from "@daostack/arc.js";

export const exampleMethod = async (web3, networkName: string, ...rest: Array<string>): Promise<void> => {
  console.log(`exampleMethod(${web3},${networkName},${rest})`);
  LoggingService.logLevel = LogLevel.all;
  await InitializeArcJs();
  return Promise.resolve();
}
