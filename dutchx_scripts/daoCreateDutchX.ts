import {
  Address,
  Auction4ReputationFactory,
  ConfigService,
  DAO,
  ExternalLocking4ReputationFactory,
  InitializeArcJs,
  LockingEth4ReputationFactory,
  LockingToken4ReputationFactory,
  // FixedReputationAllocationFactory,
  Utils,
  Web3
} from "@daostack/arc.js";

import { run as contractNew } from "../scripts/contractNew";
import { run as daoCreate } from "../scripts/daoCreate";
import { run as tokenMint } from "../scripts/tokenMint";

export const run = async (web3: Web3, networkName: string): Promise<void> => {

// tslint:disable: max-line-length

  await InitializeArcJs({
    filter: {},
  });

  ConfigService.set("estimateGas", true);

  const daoSchema = require(`../../dutchx_scripts/specsNewDaos/dutchX.${networkName.toLowerCase()}.json`);

  const lockingEth4Reputation =
    await LockingEth4ReputationFactory.at((await contractNew(web3, networkName, { name: "LockingEth4Reputation" }, "max", "50000000000") as Lock4ReputationContract).address);
  const lockingToken4Reputation =
    await LockingToken4ReputationFactory.at((await contractNew(web3, networkName, { name: "LockingToken4Reputation" }, "max", "50000000000") as Lock4ReputationContract).address);
  const externalLocking4Reputation =
    await ExternalLocking4ReputationFactory.at((await contractNew(web3, networkName, { name: "ExternalLocking4Reputation" }, "max", "50000000000") as Lock4ReputationContract).address);
  const auction4Reputation =
    await Auction4ReputationFactory.at((await contractNew(web3, networkName, { name: "Auction4Reputation" }, "max", "50000000000") as Lock4ReputationContract).address);
  // const fixedReputationAllocation =
  //   await FixedReputationAllocationFactory.at((await contractNew(web3, networkName, { "name": "FixedReputationAllocation" }, "max", "50000000000") as Lock4ReputationContract).address);
  let externalTokenLockerAddress: Address;
  let priceOracleInterfaceAddress: Address;
  let priceOracleInterfaceMock: any;
  let gnoTokenAddress: Address;
  const genTokenAddress = await Utils.getGenTokenAddress();

  switch (networkName) {
    case "Ganache":
      gnoTokenAddress = genTokenAddress;

      priceOracleInterfaceMock =
        await contractNew(web3, networkName, { name: "PriceOracleMock" }, "max", "50000000000") as any;

      priceOracleInterfaceAddress = priceOracleInterfaceMock.address;

      await priceOracleInterfaceMock.setTokenPrice(gnoTokenAddress, 380407, 200000000);

      const externalTokenLockerMock =
        await contractNew(web3, networkName, { name: "ExternalTokenLockerMock" }, "max", "50000000000") as any;

      externalTokenLockerAddress = externalTokenLockerMock.address;

      await externalTokenLockerMock.lock(100000000000000000000, { from: accounts[0] });

      break;
    case "Kovan":
      externalTokenLockerAddress = "0x4edc383adea781762b74e7082c03f423523e61bb";
      gnoTokenAddress = "0x6018bf616ec9db02f90c8c8529ddadc10a5c29dc";

      priceOracleInterfaceMock =
        await contractNew(web3, networkName, { name: "PriceOracleMock" }, "max", "50000000000") as any;

      priceOracleInterfaceAddress = priceOracleInterfaceMock.address;

      await priceOracleInterfaceMock.setTokenPrice(gnoTokenAddress, 380407, 200000000);
      await priceOracleInterfaceMock.setTokenPrice("0x4edc383adea781762b74e7082c03f423523e61bb", 380407, 200000000);
      await priceOracleInterfaceMock.setTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf", 380407, 200000000);
      break;
    case "Rinkeby":
      externalTokenLockerAddress = "0x4edc383adea781762b74e7082c03f423523e61bb";
      gnoTokenAddress = "0xd0dab4e640d95e9e8a47545598c33e31bdb53c7c";
      /**
       * This is just one they recently deployed.  It changes with each new DAO.
       */
      priceOracleInterfaceAddress = "0xe7Fd17DEa742806B600cBd29DaC91f5686FacBe2";
      // priceOracleInterfaceMock =
      //   await contractNew(web3, networkName, { name: "PriceOracleMock" }, "max", "50000000000") as any;

      // priceOracleInterfaceAddress = priceOracleInterfaceMock.address;

      // await priceOracleInterfaceMock.setTokenPrice("0xc778417e063141139fce010982780140aa0cd5ab", 380407, 200000000);
      // await priceOracleInterfaceMock.setTokenPrice("0x3615757011112560521536258c1e7325ae3b48ae", 380407, 200000000);
      // await priceOracleInterfaceMock.setTokenPrice("0x00df91984582e6e96288307e9c2f20b38c8fece9", 380407, 200000000);
      // await priceOracleInterfaceMock.setTokenPrice("0xa1f34744c80e7a9019a5cd2bf697f13df00f9773", 380407, 200000000);
      // await priceOracleInterfaceMock.setTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf", 380407, 200000000);
      break;
    case "Live":
      externalTokenLockerAddress = "";
      gnoTokenAddress = "0x6810e776880c02933d47db1b9fc05908e5386b96";
      priceOracleInterfaceAddress = "";
      break;
  }

  console.log(`gnoTokenAddress: ${gnoTokenAddress}`);
  console.log(`genTokenAddress: ${genTokenAddress}`);

  daoSchema.schemes = [...(daoSchema.schemes || []), ...
    [
      {
        address: lockingEth4Reputation.address,
        name: "LockingEth4Reputation",
      },
      {
        address: externalLocking4Reputation.address,
        name: "ExternalLocking4Reputation",
      },
      {
        address: lockingToken4Reputation.address,
        name: "LockingToken4Reputation",
      },
      {
        address: auction4Reputation.address,
        name: "Auction4Reputation",
      },
      // {
      //   "name": "FixedReputationAllocation",
      //   "address": fixedReputationAllocation.address
      // },
    ]];

  const dao = (await daoCreate(web3, networkName, daoSchema, "true")) as DAO;

  // final official dates:
  // "lockingPeriodStartDate": "2019-02-18T12:00:00.000",
  // "lockingPeriodEndDate": "2019-03-20T12:00:00.000",

// model dates:
  // const lockingPeriodStartDate = new Date("2019-01-09T12:00:00.000+0200");
  // const lockingPeriodEndDate   = new Date("2019-01-10T12:00:00.000+0200");
  // const lockingPeriodStartDate_Mgn = new Date("2019-01-10T11:00:00.000+0200");
  // const lockingPeriodEndDate_Mgn   = new Date("2019-01-10T12:00:00.000+0200");
  // const numberOfAuctions = 6;
  // const maxLockPeriod = 43200; // 12 hours in seconds
  // const reputationReward = 100000000;

  const lockingPeriodStartDate = new Date("2019-01-09T12:00:00.000+0200");
  const lockingPeriodEndDate   = new Date("2019-01-10T12:00:00.000+0200");

// tslint:disable: variable-name
  const lockingPeriodStartDate_Mgn = new Date("2019-01-10T11:00:00.000+0200");
  const lockingPeriodEndDate_Mgn   = new Date("2019-01-10T12:00:00.000+0200");

  const numberOfAuctions = 6;
  // note this may not come out even with the endDate
  const auctionPeriod = ((lockingPeriodEndDate.getTime() - lockingPeriodStartDate.getTime()) / numberOfAuctions) / 1000;
  const redeemEnableDate = lockingPeriodEndDate;
  const maxLockPeriod = 43200; // 12 hours in seconds
  const reputationReward = 100000000;

  console.log(`lockingPeriodStartDate: ${lockingPeriodStartDate.toString()}`);
  console.log(`lockingPeriodEndDate: ${lockingPeriodEndDate.toString()}`);

  await lockingEth4Reputation.initialize(
    {
      avatarAddress: dao.avatar.address,
      lockingEndTime: lockingPeriodEndDate,
      lockingStartTime: lockingPeriodStartDate,
      maxLockingPeriod: maxLockPeriod,
      redeemEnableTime: redeemEnableDate,
      reputationReward: web3.toWei(reputationReward),
    }
  );

  await externalLocking4Reputation.initialize(
    {
      avatarAddress: dao.avatar.address,
      externalLockingContract: externalTokenLockerAddress,
      getBalanceFuncSignature: "lockedTokenBalances(address)",
      lockingEndTime: lockingPeriodEndDate_Mgn,
      lockingStartTime: lockingPeriodStartDate_Mgn,
      redeemEnableTime: redeemEnableDate,
      reputationReward: web3.toWei(reputationReward),
    }
  );

  await lockingToken4Reputation.initialize(
    {
      avatarAddress: dao.avatar.address,
      lockingEndTime: lockingPeriodEndDate,
      lockingStartTime: lockingPeriodStartDate,
      maxLockingPeriod: maxLockPeriod,
      priceOracleContract: priceOracleInterfaceAddress,
      redeemEnableTime: redeemEnableDate,
      reputationReward: web3.toWei(reputationReward),
    }
  );

  await auction4Reputation.initialize(
    {
      auctionPeriod,
      auctionsStartTime: lockingPeriodStartDate,
      avatarAddress: dao.avatar.address,
      numberOfAuctions,
      redeemEnableTime: redeemEnableDate,
      reputationReward: web3.toWei(reputationReward),
      tokenAddress: genTokenAddress,
      walletAddress: dao.avatar.address,
    }
  );

  // await fixedReputationAllocation.initialize(
  //   {
  //     avatarAddress: dao.avatar.address,
  //     redeemEnableTime: redeemEnableDate,
  //     reputationReward: web3.toWei(reputationReward),
  //   }
  // );

  if (networkName === "Ganache") {
    await tokenMint(web3, networkName, gnoTokenAddress, "100", accounts[0]);
  }

  return Promise.resolve();
};

interface Lock4ReputationContract { address: Address; initialize: (...params) => Promise<any>; }
