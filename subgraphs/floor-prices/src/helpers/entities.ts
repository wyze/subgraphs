import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { getToken } from "@shared/helpers";

import { Collection, Listing, User, UserToken } from "../../generated/schema";

function toBigIntBytes(value: BigInt): Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(value));
}

export function ensureCollection(contract: Address): Collection {
  let collection = Collection.load(contract);

  if (!collection) {
    collection = new Collection(contract);

    collection.nextExpiresTimestamp = 0;
    collection.listings = [];
  }

  return collection;
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

export function ensureUser(wallet: Address): User {
  let user = User.load(wallet);

  if (!user) {
    user = new User(wallet);

    user.listings = [];
    user.save();
  }

  return user;
}

export function ensureUserToken(
  contract: Address,
  tokenId: BigInt,
  user: Address
): UserToken {
  const tokenEntityId = contract.concat(toBigIntBytes(tokenId));
  const id = tokenEntityId.concat(user);

  let userToken = UserToken.load(id);

  if (!userToken) {
    userToken = new UserToken(id);

    userToken.amount = 0;
    userToken.token = getToken(contract, tokenId.toI32()).id;
    userToken.user = ensureUser(user).id;
  }

  return userToken;
}
