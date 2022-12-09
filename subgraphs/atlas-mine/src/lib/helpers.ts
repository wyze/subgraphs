import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { toTimestamp } from "@shared/helpers";

import {
  Deposit__Params,
  Harvest__Params,
  Withdraw__Params,
} from "../../generated/Atlas Mine/AtlasMine";
import {
  Daily,
  Deposit,
  Reward,
  Unlock,
  User,
  UserUnlock,
  Withdrawal,
} from "../../generated/schema";
import {
  ONE,
  ONE_MONTH,
  SIX_MONTHS,
  THREE_MONTHS,
  TWELVE_MONTHS,
  TWO_WEEKS,
} from "./constants";

class Lock {
  constructor(public name: string, public length: i32, public vesting: i32) {}

  static twoWeeks(): Lock {
    return new Lock("TwoWeeks", TWO_WEEKS, 0);
  }

  static oneMonth(): Lock {
    return new Lock("OneMonth", ONE_MONTH, 7);
  }

  static threeMonths(): Lock {
    return new Lock("ThreeMonths", THREE_MONTHS, 14);
  }

  static sixMonths(): Lock {
    return new Lock("SixMonths", SIX_MONTHS, 30);
  }

  static twelveMonths(): Lock {
    return new Lock("TwelveMonths", TWELVE_MONTHS, 45);
  }
}

export function getLock(lock: i32): Lock {
  switch (lock) {
    case 0:
      return Lock.twoWeeks();
    case 1:
      return Lock.oneMonth();
    case 2:
      return Lock.threeMonths();
    case 3:
      return Lock.sixMonths();
    case 4:
      return Lock.twelveMonths();
    default:
      throw new Error("Unhandled lock");
  }
}

function getId(user: Address, index: BigInt): Bytes {
  return user.concat(Bytes.fromI32(index.toI32()));
}

export function ensureDaily(blockstamp: BigInt): Daily {
  const timestamp = toTimestamp(blockstamp);
  const id = Bytes.fromI32(timestamp.day);

  let daily = Daily.load(id);

  if (!daily) {
    daily = new Daily(id);

    daily.date = timestamp.daystamp;
    daily.depositCount = 0;
    daily.deposited = BigDecimal.zero();
    daily.harvestCount = 0;
    daily.harvested = BigDecimal.zero();
    daily.unlockCounts = 0;
    daily.unlocked = BigDecimal.zero();
    daily.withdrawalCounts = 0;
    daily.withdrawn = BigDecimal.zero();

    daily.save();
  }

  return daily;
}

export function ensureDeposit(params: Deposit__Params): Deposit {
  const deposit = new Deposit(getId(params.user, params.index));

  deposit.amount = params.amount.divDecimal(ONE);
  deposit.lock = getLock(params.lock).name;
  deposit.reward = deposit.id;
  deposit.user = ensureUser(params.user).id;
  deposit.withdrawal = deposit.id;

  return deposit;
}

export function ensureReward(params: Harvest__Params): Reward {
  const id = getId(params.user, params.index);

  let reward = Reward.load(id);

  if (!reward) {
    reward = new Reward(id);

    reward.amount = BigDecimal.zero();
    reward.deposit = id;
    reward.user = params.user;
  }

  return reward;
}

export function ensureUnlock(blockstamp: BigInt, lock: Lock): Unlock {
  const future = blockstamp.plus(BigInt.fromI32(lock.length));
  const timestamp = toTimestamp(future);
  const id = Bytes.fromI32(timestamp.day).concat(Bytes.fromUTF8(lock.name));

  let unlock = Unlock.load(id);

  if (!unlock) {
    unlock = new Unlock(id);

    const daily = ensureDaily(future);

    unlock.amount = BigDecimal.zero();
    unlock.day = daily.id;
    unlock.lock = lock.name;

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

export function ensureUserUnlock(user: User, deposit: Deposit): UserUnlock {
  const id = user.id.concat(deposit.id);

  let userUnlock = UserUnlock.load(id);

  if (!userUnlock) {
    userUnlock = new UserUnlock(id);

    userUnlock.amount = BigDecimal.zero();
    userUnlock.deposit = deposit.id;
    userUnlock.user = user.id;
  }

  return userUnlock;
}

export function ensureWithdrawal(params: Withdraw__Params): Withdrawal {
  const id = getId(params.user, params.index);

  let withdrawal = Withdrawal.load(id);

  if (!withdrawal) {
    withdrawal = new Withdrawal(id);

    withdrawal.amount = BigDecimal.zero();
    withdrawal.deposit = id;
    withdrawal.user = params.user;
  }

  return withdrawal;
}
