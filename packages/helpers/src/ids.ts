import { Bytes, ethereum } from "@graphprotocol/graph-ts";

export function getId(event: ethereum.Event): Bytes {
  return event.transaction.hash.concat(Bytes.fromI32(event.logIndex.toI32()));
}
