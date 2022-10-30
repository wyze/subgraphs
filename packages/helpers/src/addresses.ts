import { Address } from "@graphprotocol/graph-ts";

export function isZero(address: Address): boolean {
  return address.equals(Address.zero());
}
