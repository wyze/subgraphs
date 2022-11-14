import {
  Address,
  BigInt,
  Bytes,
  Value,
  ethereum,
} from "@graphprotocol/graph-ts";

import { Approval, Transfer } from "./entities";
import { getToken } from "./models";
import { toTimestamp } from "./numbers";

class TransferParams {
  amount: Value;
  from: Address;
  operator: Address;
  to: Address;
  tokenId: BigInt | null;
}

class ApprovalParams {
  operator: Address;
  owner: Address;
  value: Value;
}

function getId(event: ethereum.Event): Bytes {
  return event.transaction.hash.concat(Bytes.fromI32(event.logIndex.toI32()));
}

export function handleApproval(
  event: ethereum.Event,
  params: ApprovalParams
): void {
  const approval = new Approval(getId(event));
  const block = event.block;

  approval.blockNumber = block.number.toI32();
  approval.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  approval.operator = params.operator;
  approval.owner = params.owner;
  approval.value = params.value;

  approval.save();
}

export function handleTransfer<Params extends TransferParams>(
  event: ethereum.Event,
  params: Params
): void {
  const transfer = new Transfer(getId(event));
  const block = event.block;

  transfer.amount = params.amount;
  transfer.blockNumber = block.number.toI32();
  transfer.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  transfer.from = params.from;
  transfer.operator = params.operator;
  transfer.to = params.to;

  const tokenId = params.tokenId;

  if (tokenId) {
    transfer.token = getToken(event.address, tokenId.toI32()).id;
  }

  transfer.save();
}
