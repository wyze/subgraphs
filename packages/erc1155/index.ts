import {
  Address,
  BigInt,
  Bytes,
  Value,
  ethereum,
} from "@graphprotocol/graph-ts";

import { DEAD_ADDRESS } from "@shared/constants";
import {
  Direction,
  TransferParams,
  createConfig,
  ensureTransfer,
  ensureUser,
  ensureUserToken,
  getConfig,
  getToken,
  handleApproval,
  isSink,
  isZero,
  toI32Value,
  toTimestamp,
} from "@shared/helpers";

import { Daily, UserDaily } from "./src/entities";
import { ApprovalForAll, TransferBatch, TransferSingle } from "./src/events";

class DailyParams {
  amount: i32;
  from: Address;
  operator: Address;
  to: Address;
  tokenId: BigInt;
}

class UserDailyParams {
  amount: i32;
  address: Address;
  direction: Direction;
  tokenId: BigInt;
}

export function onApproval(event: ApprovalForAll): void {
  const params = event.params;

  handleApproval(event, {
    operator: params.operator,
    owner: params.owner,
    value: Value.fromBoolean(params.approved),
  });
}

function onTransfer(
  event: ethereum.Event,
  params: TransferParams,
  tokenId: BigInt
): void {
  const amount = params.amount.toI32();
  const from = params.from;
  const operator = params.operator;
  const to = params.to;

  createConfig(event.address);

  if (getConfig().ignoredTokens.includes(tokenId.toI32())) {
    return;
  }

  if (!isZero(params.from)) {
    const userToken = ensureUserToken(event.address, tokenId, from);

    userToken.amount -= amount;
    userToken.save();
  }

  if (!isZero(params.to) && params.to.notEqual(DEAD_ADDRESS)) {
    const userToken = ensureUserToken(event.address, tokenId, to);

    userToken.amount += amount;
    userToken.save();
  }

  const transfer = ensureTransfer(event, params);

  transfer.token = getToken(event.address, tokenId.toI32()).id;
  transfer.save();

  updateDaily(event, { amount, from, operator, to, tokenId });

  updateUserDaily(event, {
    address: to,
    amount,
    direction: Direction.In,
    tokenId,
  });

  updateUserDaily(event, {
    address: from,
    amount,
    direction: Direction.Out,
    tokenId,
  });
}

export function onTransferBatch(event: TransferBatch): void {
  const params = event.params;

  for (let index = 0; index < params.ids.length; index++) {
    const id = params.ids[index];
    const amount = params.amounts[index];
    const from = params.from;
    const operator = params.operator;
    const to = params.to;

    onTransfer(event, { amount: toI32Value(amount), from, operator, to }, id);
  }
}

export function onTransferSingle(event: TransferSingle): void {
  const params = event.params;

  const amount = params.amount;
  const from = params.from;
  const operator = params.operator;
  const to = params.to;
  const tokenId = params.id;

  onTransfer(
    event,
    { amount: toI32Value(amount), from, operator, to },
    tokenId
  );
}

function updateDaily(event: ethereum.Event, params: DailyParams): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const tokenId = params.tokenId.toI32();
  const id = Bytes.fromI32(timestamp.day).concat(Bytes.fromI32(tokenId));

  let daily = Daily.load(id);

  if (!daily) {
    daily = new Daily(id);

    daily.date = timestamp.daystamp;

    daily.burns = 0;
    daily.mints = 0;
    daily.sinks = 0;
    daily.transfers = 0;
  }

  // Stats
  daily.burns += params.to.equals(Address.zero()) ? params.amount : 0;
  daily.mints += params.from.equals(Address.zero()) ? params.amount : 0;
  daily.sinks += isSink(params.to, params.operator)
    ? params.amount
    : isSink(params.from, Address.zero())
    ? -params.amount
    : 0;
  daily.transfers += params.amount;

  // Token
  daily.token = getToken(event.address, tokenId).id;

  daily.save();
}

function updateUserDaily(event: ethereum.Event, params: UserDailyParams): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const address = params.address;
  const id = address.concat(Bytes.fromI32(timestamp.daystamp));

  if (isZero(params.address)) {
    return;
  }

  const user = ensureUser(address);
  const token = ensureUserToken(
    address,
    params.tokenId,
    Address.fromBytes(user.id)
  );

  let daily = UserDaily.load(id);

  if (!daily) {
    daily = new UserDaily(id);

    daily.date = timestamp.daystamp;
    daily.user = user.id;

    daily.amount = token.amount;
    daily.token = getToken(event.address, params.tokenId.toI32()).id;
  }

  // Stats
  daily.amount =
    params.direction === Direction.In
      ? daily.amount + params.amount
      : daily.amount - params.amount;

  user.save();
  daily.save();
}
