import {
  Address,
  BigDecimal,
  Bytes,
  Value,
  ethereum,
} from "@graphprotocol/graph-ts";

import { USDC_ADDRESS } from "@shared/constants";
import {
  Direction,
  TransferParams,
  handleTransfer,
  isZero,
  toTimestamp,
} from "@shared/helpers";

import { User, UserDaily } from "./src/entities";
import { Transfer } from "./src/events";

class UserDailyParams {
  amount: BigDecimal;
  address: Address;
  direction: Direction;
}

function ensureUser(id: Address): void {
  if (isZero(id)) {
    return;
  }

  if (!User.load(id)) {
    const user = new User(id);

    user.balance = BigDecimal.zero();
    user.received = BigDecimal.zero();
    user.receivedCount = 0;
    user.sent = BigDecimal.zero();
    user.sentCount = 0;

    user.save();
  }
}

function getDivisor(address: Address): BigDecimal {
  return BigDecimal.fromString(`${address.equals(USDC_ADDRESS) ? 1e6 : 1e18}`);
}

export function onTransfer(event: Transfer): void {
  const params = event.params;
  const operator = event.transaction.to;

  const amount = params.amount.divDecimal(getDivisor(event.address));
  const from = params.from;
  const to = params.to;

  handleTransfer(
    event,
    new TransferParams(
      Value.fromBigDecimal(amount),
      from,
      operator ? operator : Address.zero(),
      to
    )
  );

  ensureUser(from);
  ensureUser(to);

  updateUserDaily(event, { address: from, amount, direction: Direction.Out });
  updateUserDaily(event, { address: to, amount, direction: Direction.In });
}

function updateUserDaily(event: ethereum.Event, params: UserDailyParams): void {
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
