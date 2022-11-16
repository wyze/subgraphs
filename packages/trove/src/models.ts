import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { ensureUser, getToken } from "@shared/helpers";

import { Listing } from "./entities";

function toBigIntBytes(value: BigInt): Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(value));
}

export function ensureListing(
  contract: Address,
  tokenId: BigInt,
  user: Address
): Listing {
  const tokenEntityId = contract.concat(toBigIntBytes(tokenId));
  const id = tokenEntityId.concat(user);

  let listing = Listing.load(id);

  if (!listing) {
    listing = new Listing(id);

    listing.amount = 0;
    listing.available = id;
    listing.expires = i32.MAX_VALUE;
    listing.price = BigDecimal.zero();
    listing.token = getToken(contract, tokenId.toI32()).id;
    listing.status = "Unknown";
    listing.user = ensureUser(user).id;
  }

  return listing;
}
