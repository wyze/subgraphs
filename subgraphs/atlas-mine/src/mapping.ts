import { BigDecimal, BigInt, store } from "@graphprotocol/graph-ts";

import {
  Deposit,
  Harvest,
  Staked,
  Unstaked,
  Withdraw,
} from "../generated/Atlas Mine/AtlasMine";
import { DAY, ONE } from "./lib/constants";
import {
  ensureDaily,
  ensureDeposit,
  ensureDepositUnlock,
  ensureReward,
  ensureStakedToken,
  ensureUnlock,
  ensureUser,
  ensureWithdrawal,
  getLock,
  getUserOrMultisigAddress,
} from "./lib/helpers";

export function onDeposit(event: Deposit): void {
  const params = event.params;
  const lock = getLock(params.lock);
  const timestamp = event.block.timestamp;

  const daily = ensureDaily(timestamp);
  const deposit = ensureDeposit(params);
  const user = ensureUser(params.user);

  deposit.day = daily.id;
  deposit.save();

  daily.depositCount += 1;
  daily.deposited = daily.deposited.plus(params.amount.divDecimal(ONE));
  daily.save();

  if (lock.vesting) {
    const amount = params.amount.divDecimal(
      BigDecimal.fromString(`${lock.vesting * 1e18}`)
    );

    for (let index = 0; index < lock.vesting; index++) {
      const blockstamp = timestamp.plus(BigInt.fromI32(DAY * index));
      const unlock = ensureUnlock(blockstamp, lock);

      unlock.amount = unlock.amount.plus(amount);
      unlock.save();

      const depositUnlock = ensureDepositUnlock(user, deposit, unlock);

      depositUnlock.amount = amount;
      depositUnlock.save();

      const daily = ensureDaily(blockstamp);

      daily.unlockCounts += 1;
      daily.unlocked = daily.unlocked.plus(amount);
      daily.save();
    }
  } else {
    const amount = params.amount.divDecimal(ONE);
    const unlock = ensureUnlock(timestamp, lock);

    unlock.amount = unlock.amount.plus(amount);
    unlock.save();

    const depositUnlock = ensureDepositUnlock(user, deposit, unlock);

    depositUnlock.amount = amount;
    depositUnlock.save();

    const daily = ensureDaily(timestamp.plus(BigInt.fromI32(lock.length)));

    daily.unlockCounts += 1;
    daily.unlocked = daily.unlocked.plus(amount);
    daily.save();
  }
}

export function onHarvest(event: Harvest): void {
  const params = event.params;
  const amount = params.amount.divDecimal(ONE);

  const daily = ensureDaily(event.block.timestamp);
  const reward = ensureReward(params);

  reward.amount = reward.amount.plus(amount);
  reward.day = daily.id;
  reward.save();

  daily.harvestCount += 1;
  daily.harvested = daily.harvested.plus(amount);
  daily.save();
}

export function onWithdraw(event: Withdraw): void {
  const params = event.params;
  const amount = params.amount.divDecimal(ONE);

  const daily = ensureDaily(event.block.timestamp);
  const withdrawal = ensureWithdrawal(params);

  withdrawal.amount = withdrawal.amount.plus(amount);
  withdrawal.day = daily.id;
  withdrawal.save();

  daily.withdrawalCounts += 1;
  daily.withdrawn = daily.withdrawn.plus(amount);
  daily.save();
}

export function onStaked(event: Staked): void {
  const params = event.params;
  const userAddress = getUserOrMultisigAddress(event);

  const stakedToken = ensureStakedToken(
    userAddress,
    params.nft,
    params.tokenId.toI32()
  );
  stakedToken.amount += params.amount.toI32();
  stakedToken.save();
}

export function onUnstaked(event: Unstaked): void {
  const params = event.params;
  const userAddress = getUserOrMultisigAddress(event);

  const stakedToken = ensureStakedToken(
    userAddress,
    params.nft,
    params.tokenId.toI32()
  );
  stakedToken.amount -= params.amount.toI32();

  if (stakedToken.amount > 0) {
    stakedToken.save();
  } else {
    store.remove("StakedToken", stakedToken.id.toHexString());
  }
}
