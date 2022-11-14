import { Address, BigDecimal, Bytes, ethereum } from "@graphprotocol/graph-ts";

import { USDC_ADDRESS } from "@shared/constants";
import {
  Direction,
  handleApproval,
  handleTransfer,
  isZero,
  toBigDecimal,
  toTimestamp,
} from "@shared/helpers";

import { Daily, User, UserDaily } from "./helpers/entities";
import { Approval, Transfer } from "./helpers/events";

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

function getDivisor(address: Address): BigDecimal {
  return BigDecimal.fromString(`${address.equals(USDC_ADDRESS) ? 1e6 : 1e18}`);
}

export function onApproval(event: Approval): void {
  const params = event.params;

  handleApproval(event, {
    operator: params.operator,
    owner: params.owner,
    value: toBigDecimal(params.value.divDecimal(getDivisor(event.address))),
  });
}

export function onTransfer(event: Transfer): void {
  const params = event.params;
  const operator = event.transaction.to;

  const amount = params.amount.divDecimal(getDivisor(event.address));
  const from = params.from;
  const to = params.to;

  handleTransfer(event, {
    amount: toBigDecimal(amount),
    from,
    operator: operator ? operator : Address.zero(),
    to,
    tokenId: null,
  });

  updateDaily(event, { amount, from, to });
  updateUserDaily(event, { address: from, amount, direction: Direction.Out });
  updateUserDaily(event, { address: to, amount, direction: Direction.In });
}

function updateDaily(event: ethereum.Event, params: DailyParams): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const id = Bytes.fromI32(timestamp.day);
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

function updateUserDaily(
  event: ethereum.Event,
  params: UserDailyParams
): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const address = params.address;
  const id = address.concat(Bytes.fromI32(timestamp.day));

  if (isZero(params.address)) {
    return;
  }

  let user = User.load(address);

  if (!user) {
    user = new User(address);

    user.balance = BigDecimal.zero();
    user.received = BigDecimal.zero();
    user.receivedCount = 0;
    user.sent = BigDecimal.zero();
    user.sentCount = 0;
  }

  let daily = UserDaily.load(id);

  if (!daily) {
    daily = new UserDaily(id);

    daily.date = timestamp.daystamp;
    daily.user = user.id;

    daily.balance = user.balance;
    daily.received = BigDecimal.zero();
    daily.receivedCount = 0;
    daily.sent = BigDecimal.zero();
    daily.sentCount = 0;
  }

  user.balance =
    params.direction === Direction.In
      ? user.balance.plus(params.amount)
      : user.balance.minus(params.amount);

  daily.balance =
    params.direction === Direction.In
      ? daily.balance.plus(params.amount)
      : daily.balance.minus(params.amount);

  if (params.direction === Direction.In) {
    user.received = user.received.plus(params.amount);
    user.receivedCount += 1;
    daily.received = daily.received.plus(params.amount);
    daily.receivedCount += 1;
  } else {
    user.sent = user.sent.plus(params.amount);
    user.sentCount += 1;
    daily.sent = daily.sent.plus(params.amount);
    daily.sentCount += 1;
  }

  user.save();
  daily.save();
}
