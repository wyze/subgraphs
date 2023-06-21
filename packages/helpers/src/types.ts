import { Address, Value } from "@graphprotocol/graph-ts";

export enum Direction {
  In,
  Out,
}

export class TransferParams {
  constructor(
    public amount: Value,
    public from: Address,
    public operator: Address,
    public to: Address
  ) {}
}
