import { BigInt, Value } from "@graphprotocol/graph-ts";

class Timestamp {
  day: i32;
  daystamp: i32;
  hour: i32;
  hourstamp: i32;
  timestamp: i32;
}

export function formatTime(time: BigInt): i32 {
  const length = time.toString().length;

  return length <= 10
    ? time.toI32()
    : BigInt.fromString(time.toString().slice(0, -3)).toI32();
}

export function toTimestamp(value: BigInt): Timestamp {
  const timestamp = value.toI32();
  const day = timestamp / 86400;
  const daystamp = day * 86400;
  const hour = timestamp / 3600;
  const hourstamp = hour * 3600;

  return { day, daystamp, hour, hourstamp, timestamp };
}
