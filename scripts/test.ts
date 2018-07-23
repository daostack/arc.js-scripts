import {
  InitializeArcJs,
  LoggingService,
  LogLevel
} from "@daostack/arc.js";

export const test = async (web3, networkName: string): Promise<void> => {
  console.log(`in test against ${networkName}`);
  LoggingService.logLevel = LogLevel.all;
  await InitializeArcJs();
  return Promise.resolve();
}
