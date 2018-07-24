import {
  InitializeArcJs,
  LoggingService,
  LogLevel,
  DAO,
  ConfigService,
  Web3,
  Address,
  DecodedLogEntryEvent
} from "@daostack/arc.js";
import { BigNumber } from '../node_modules/bignumber.js';

interface FounderSpec {
  /**
   * Founders' address
   */
  address: string;
  /**
   * string | number token amount to be awarded to each founder, in GEN
   */
  tokens: string | number;
  /**
   * string | number reputation amount to be awarded to each founder,
   * in units of the Genesis Reputation system.
   */
  reputation: string | number;
}

/**
 * List participants (as measured by reputation) in the given dao, sorted in descending order of reputation,
 * including the total amount of reputation, the amount per founder and their percentage of the total.
 * @param web3 
 * @param networkName 
 * @param avatar 
 */
export const list = async (web3: Web3, networkName: string, avatar: Address): Promise<void> => {

  if (!avatar) {
    return Promise.reject("avatar was not supplied")
  }

  LoggingService.logLevel = LogLevel.info | LogLevel.error;

  await InitializeArcJs();

  let dao: DAO = await DAO.at(avatar);

  // TODO: let DAO do this, when available
  const participants = await getParticipants(dao);

  participants.sort((a: Participant, b: Participant): number => {
    return (b.reputation.sub(a.reputation)).toNumber();
  });

  participants.forEach((p) => {
    console.log(`${p.address} : ${web3.fromWei(p.reputation).toString(10)} : ${p.percentageOfTotal.toFixed(2)}`);
  });

  return Promise.resolve();
}

export interface Participant {
  address: Address;
  reputation?: BigNumber;
  percentageOfTotal?: number;
}

export interface ReputationMintEventResult {
  /**
   * The recipient of reputation
   * indexed
   */
  _to: Address;
  /**
   * Amount minted
   */
  _amount: BigNumber;
}

const getParticipants = async (dao: DAO): Promise<Array<Participant>> => {

  const addresses = new Set<Address>();
  let participants: Array<Participant>;

  const fetcher = dao.reputation.Mint({}, Object.assign({ fromBlock: 0 }));

  const eventLog = await new Promise<Array<DecodedLogEntryEvent<ReputationMintEventResult>>>(
    (resolve: (result: Array<DecodedLogEntryEvent<ReputationMintEventResult>>) => void,
      reject: (error: Error) => void): void => {

      fetcher.get((error: Error, events: DecodedLogEntryEvent<ReputationMintEventResult> | Array<DecodedLogEntryEvent<ReputationMintEventResult>>): void => {
        if (error) {
          return reject(error);
        }
        if (!Array.isArray(events)) {
          events = [events];
        }
        return resolve(events);
      });
    });

  eventLog.forEach(
    (event: DecodedLogEntryEvent<ReputationMintEventResult>): void => {
      addresses.add(event.args._to);
    });

  participants = new Array<Participant>();

  for (const account of addresses) {
    const balance = await dao.reputation.reputationOf(account);
    if (balance.gt(0)) {
      participants.push({ address: account, reputation: balance });
    }
  }

  const totalReputation = participants
    .map((p: Participant) => p.reputation)
    .reduce((prev: BigNumber, current: BigNumber) => prev.add(current));

  console.log(`total reputation: ${web3.fromWei(totalReputation)}`);

  participants.forEach((p: Participant) => { p.percentageOfTotal = p.reputation.div(totalReputation).toNumber(); })

  return participants;
}
