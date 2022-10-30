import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";

import { Approval, Transfer } from "./entities";
import { getToken } from "./models";
import { toTimestamp } from "./numbers";

class TransferParams {
  amount: BigDecimal;
  from: Address;
  operator: Address;
  to: Address;
  tokenId: BigInt | null;
}

class ApprovalParams {
  operator: Address;
  owner: Address;
  value: BigDecimal;
}

function addToken(
  transfer: Transfer,
  address: Address,
  biTokenId: BigInt
): void {
  const tokenId = biTokenId.toI32();

  transfer.token = getToken(address, tokenId).id;
  // transfer.tokenId = tokenId;
}

function getId(event: ethereum.Event): string {
  return `${event.transaction.hash.toHexString()}-${event.logIndex.toString()}`;
}

// TODO: Convert to Bytes
export function handleApproval(
  event: ethereum.Event,
  params: ApprovalParams
): void {
  const approval = new Approval(getId(event));
  const block = event.block;

  approval.blockNumber = block.number.toI32();
  approval.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  approval.operator = params.operator.toHexString();
  approval.owner = params.owner.toHexString();
  approval.value = params.value;

  approval.save();
}

// TODO: Convert to Bytes
export function handleTransfer(
  event: ethereum.Event,
  params: TransferParams
): void {
  const transfer = new Transfer(getId(event));

  const block = event.block;

  transfer.amount = params.amount;
  transfer.blockNumber = block.number.toI32();
  transfer.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  transfer.from = params.from.toHexString();
  transfer.operator = params.operator.toHexString();
  transfer.to = params.to.toHexString();

  const tokenId = params.tokenId;

  if (tokenId) {
    addToken(transfer, event.address, tokenId);
  }

  transfer.save();
}
