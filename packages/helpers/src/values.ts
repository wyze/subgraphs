import { BigInt, Value } from "@graphprotocol/graph-ts";

export function toI32Value(value: BigInt): Value {
  return Value.fromI32(value.toI32());
}

export function toBooleanValue(value: boolean): Value {
  return Value.fromBoolean(value);
}
