import { Address, Bytes, Value, ethereum } from "@graphprotocol/graph-ts";

import { Approval, Transfer } from "./entities";
import { getId } from "./ids";
import { toTimestamp } from "./numbers";
import { TransferParams } from "./types";

class ApprovalParams {
  operator: Address;
  owner: Address;
  value: Value;
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

export function handleTransfer(
  event: ethereum.Event,
  params: TransferParams
): void {
  const transfer = new Transfer(getId(event));
  const block = event.block;

  transfer.amount = params.amount;
  transfer.blockNumber = block.number.toI32();
  transfer.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  transfer.from = params.from;
  transfer.operator = params.operator;
  transfer.to = params.to;

  transfer.save();
}
