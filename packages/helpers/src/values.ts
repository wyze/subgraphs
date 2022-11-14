import { BigDecimal, BigInt, Value } from "@graphprotocol/graph-ts";

export function toBigDecimal(value: BigDecimal): Value {
  return Value.fromBigDecimal(value);
}

export function toBooleanValue(value: boolean): Value {
  return Value.fromBoolean(value);
}

export function toI32Value(value: BigInt): Value {
  return Value.fromI32(value.toI32());
}
