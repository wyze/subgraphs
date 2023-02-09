import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { toTimestamp } from "@shared/helpers";

import {
  DailyExtractor,
  DailyHarvester,
  DailyTimelock,
  Deposit,
  DepositUnlock,
  Extractor,
  Harvester,
  Reward,
  StakedToken,
  Timelock,
  Unlock,
  User,
  Withdrawal,
} from "../../generated/schema";
import {
  Deposit__Params,
  Harvest__Params,
  Withdraw__Params,
} from "../../generated/templates/Harvester/Harvester";
import { NAMES, ONE } from "./constants";

function getId(user: Address, index: BigInt): Bytes {
  return user.concat(Bytes.fromI32(index.toI32()));
}

export function ensureDailyExtractor(
  address: Bytes,
  blockstamp: BigInt
): DailyExtractor {
  const timestamp = toTimestamp(blockstamp);
  const id = address.concatI32(timestamp.day);

  let daily = DailyExtractor.load(id);

  if (!daily) {
    daily = new DailyExtractor(id);

    daily.date = timestamp.daystamp;
    daily.harvester = address;
    daily.large = 0;
    daily.medium = 0;
    daily.small = 0;

    daily.save();
  }

  return daily;
}

export function ensureDailyHarvester(
  address: Address,
  blockstamp: BigInt
): DailyHarvester {
  const timestamp = toTimestamp(blockstamp);
  const id = address.concatI32(timestamp.day);

  let daily = DailyHarvester.load(id);

  if (!daily) {
    daily = new DailyHarvester(id);

    daily.date = timestamp.daystamp;
    daily.extractorLarge = 0;
    daily.extractorMedium = 0;
    daily.extractorSmall = 0;
    daily.harvestCount = 0;
    daily.harvested = BigDecimal.zero();
    daily.harvester = address;
    daily.stakedLegions = 0;
    daily.stakedTreasures = 0;

    daily.save();
  }

  return daily;
}

export function ensureDailyTimelock(
  timelock: Timelock,
  blockstamp: BigInt
): DailyTimelock {
  const timestamp = toTimestamp(blockstamp);
  const id = timelock.harvester.concatI32(timestamp.day);

  let daily = DailyTimelock.load(id);

  if (!daily) {
    daily = new DailyTimelock(id);

    daily.date = timestamp.daystamp;
    daily.depositCount = 0;
    daily.deposited = BigDecimal.zero();
    daily.harvester = timelock.harvester;
    daily.timelock = timelock.id;
    daily.unlockCounts = 0;
    daily.unlocked = BigDecimal.zero();
    daily.withdrawalCounts = 0;
    daily.withdrawn = BigDecimal.zero();

    daily.save();
  }

  return daily;
}

export function ensureDeposit(
  address: Address,
  params: Deposit__Params
): Deposit {
  const id = getId(params.user, params.index);
  const deposit = new Deposit(address.concat(id));

  deposit.amount = params.amount.divDecimal(ONE);
  deposit.timelock = ensureTimelock(address, params.lock).id;
  deposit.reward = address.concat(params.user);
  deposit.user = ensureUser(params.user).id;

  return deposit;
}

export function ensureDepositById(id: Bytes): Deposit {
  const deposit = Deposit.load(id);

  if (!deposit) {
    throw new Error("~> No deposit found");
  }

  return deposit;
}

export function ensureDepositUnlock(
  user: User,
  deposit: Deposit,
  unlock: Unlock
): DepositUnlock {
  const id = user.id.concat(deposit.id).concat(unlock.id);
  const depositUnlock = new DepositUnlock(id);

  depositUnlock.deposit = deposit.id;
  depositUnlock.unlock = unlock.id;
  depositUnlock.user = user.id;

  return depositUnlock;
}

export function ensureExtractor(
  address: Bytes,
  spotId: i32,
  timestamp: BigInt
): Extractor {
  const id = address.concatI32(spotId).concatI32(timestamp.toI32());

  let extractor = Extractor.load(id);

  if (!extractor) {
    extractor = new Extractor(id);

    extractor.deployed = timestamp;
    extractor.harvester = address;
    extractor.spotId = spotId;
  }

  return extractor;
}

export function ensureHarvester(id: Address): Harvester {
  let harvester = Harvester.load(id);

  if (!harvester) {
    harvester = new Harvester(id);

    harvester.name = "Unknown";

    const name = NAMES.get(id.toHexString());

    if (name) {
      harvester.name = name;
    }
  }

  return harvester;
}

export function ensureTimelock(address: Address, lock: BigInt): Timelock {
  const id = address.concatI32(lock.toI32());

  let timelock = Timelock.load(id);

  if (!timelock) {
    timelock = new Timelock(id);
    timelock.harvester = address;
  }

  return timelock;
}

export function ensureTimelockById(id: Bytes): Timelock {
  const timelock = Timelock.load(id);

  if (!timelock) {
    throw new Error("~> Timelock not found");
  }

  return timelock;
}

export function ensureReward(
  address: Address,
  params: Harvest__Params
): Reward {
  const id = address.concat(params.user);

  let reward = Reward.load(id);

  if (!reward) {
    reward = new Reward(id);

    reward.amount = BigDecimal.zero();
    reward.user = params.user;
  }

  return reward;
}

export function ensureStakedToken(
  handler: Address,
  user: Address,
  contract: Address,
  tokenId: i32
): StakedToken {
  const id = user.concat(contract).concat(Bytes.fromI32(tokenId));

  let stakedToken = StakedToken.load(id);

  if (!stakedToken) {
    stakedToken = new StakedToken(id);
    stakedToken.user = ensureUser(user).id;
    stakedToken.contract = contract;
    stakedToken.tokenId = tokenId;
    stakedToken.handler = handler;
    stakedToken.amount = 0;
    stakedToken.save();
  }

  return stakedToken;
}

export function ensureUnlock(blockstamp: BigInt, timelock: Timelock): Unlock {
  const future = blockstamp.plus(BigInt.fromI32(timelock.duration));
  const timestamp = toTimestamp(future);
  const id = Bytes.fromI32(timestamp.day).concatI32(timelock.duration);

  let unlock = Unlock.load(id);

  if (!unlock) {
    unlock = new Unlock(id);

    const daily = ensureDailyTimelock(timelock, future);

    unlock.amount = BigDecimal.zero();
    unlock.day = daily.id;
    unlock.timelock = timelock.id;

    daily.save();
  }

  return unlock;
}

export function ensureUser(id: Address): User {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.save();
  }

  return user;
}

export function ensureWithdrawal(
  address: Address,
  params: Withdraw__Params
): Withdrawal {
  const id = address.concat(getId(params.user, params.index));

  let withdrawal = Withdrawal.load(id);

  if (!withdrawal) {
    withdrawal = new Withdrawal(id);

    withdrawal.deposit = id;
    withdrawal.user = params.user;
  }

  return withdrawal;
}
