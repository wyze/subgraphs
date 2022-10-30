import { Address, BigDecimal, ethereum } from "@graphprotocol/graph-ts";

import { Direction, isZero, toTimestamp } from "@shared/helpers";

import { Daily, User, UserDaily } from "./helpers/entities";

class DailyParams {
  amount: BigDecimal;
  from: Address;
  to: Address;
}

class UserDailyParams {
  amount: BigDecimal;
  address: Address;
  direction: Direction;
}

export function updateDaily(event: ethereum.Event, params: DailyParams): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const id = `${timestamp.day}`;
  const isBurn = isZero(params.to);
  const isMint = isZero(params.from);

  let daily = Daily.load(id);

  if (!daily) {
    daily = new Daily(id);

    daily.date = timestamp.daystamp;

    daily.burned = BigDecimal.zero();
    daily.burns = 0;
    daily.minted = BigDecimal.zero();
    daily.mints = 0;
    daily.transferred = BigDecimal.zero();
    daily.transfers = 0;
  }

  // Stats
  daily.burned = isBurn ? daily.burned.plus(params.amount) : daily.burned;
  daily.burns += isBurn ? 1 : 0;
  daily.minted = isMint ? daily.minted.plus(params.amount) : daily.minted;
  daily.mints += isMint ? 1 : 0;
  daily.transferred = daily.transferred.plus(params.amount);
  daily.transfers += 1;

  daily.save();
}

export function updateUserDaily(
  event: ethereum.Event,
  params: UserDailyParams
): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const address = params.address.toHexString();
  const id = `${address}-${timestamp.day}`;

  if (isZero(params.address)) {
    return;
  }

  let user = User.load(address);

  if (!user) {
    user = new User(address);

    user.balance = BigDecimal.zero();
  }

  let daily = UserDaily.load(id);

  if (!daily) {
    daily = new UserDaily(id);

    daily.date = timestamp.daystamp;
    daily.user = user.id;

    daily.balance = user.balance;
  }

  // Stats
  user.balance =
    params.direction === Direction.In
      ? user.balance.plus(params.amount)
      : user.balance.minus(params.amount);
  daily.balance =
    params.direction === Direction.In
      ? daily.balance.plus(params.amount)
      : daily.balance.minus(params.amount);

  user.save();
  daily.save();
}
