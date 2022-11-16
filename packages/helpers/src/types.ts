import { Address, Value } from "@graphprotocol/graph-ts";

export enum Direction {
  In,
  Out,
}

export class TransferParams {
  amount: Value;
  from: Address;
  operator: Address;
  to: Address;
}
