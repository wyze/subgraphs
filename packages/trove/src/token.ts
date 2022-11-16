import { Address } from "@graphprotocol/graph-ts";

import { getConfig } from "@shared/helpers";

export function isIgnoredToken(address: Address): boolean {
  return getConfig().address.notEqual(address);
}
