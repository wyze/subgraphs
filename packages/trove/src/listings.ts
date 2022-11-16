import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  store,
} from "@graphprotocol/graph-ts";

import { ensureUser, getConfig, getToken } from "@shared/helpers";

import { Listing } from "./entities";
import { ensureListing } from "./models";
import { isIgnoredToken } from "./token";

class ListedParams {
  expirationTime: BigInt;
  nft: Address;
  pricePerItem: BigInt;
  quantity: BigInt;
  seller: Address;
  tokenId: BigInt;
}

class SoldParams {
  nft: Address;
  pricePerItem: BigInt;
  quantity: BigInt;
  seller: Address;
  tokenId: BigInt;
}

export function onItemListedOrUpdated<T extends ListedParams>(params: T): void {
  if (isIgnoredToken(params.nft)) {
    return;
  }

  const listing = ensureListing(params.nft, params.tokenId, params.seller);

  listing.amount = params.quantity.toI32();
  listing.expires = params.expirationTime.toI32();
  listing.price = params.pricePerItem.divDecimal(
    BigDecimal.fromString(`${1e18}`)
  );
  listing.status = "Active";
  listing.token = getToken(params.nft, params.tokenId.toI32()).id;
  listing.user = params.seller;

  listing.save();

  const config = getConfig();

  if (!config.listings.includes(listing.id)) {
    config.listings = config.listings.concat([listing.id]);
    config.save();
  }

  const user = ensureUser(params.seller);

  if (!user.listings.includes(listing.id)) {
    user.listings = user.listings.concat([listing.id]);
    user.save();
  }
}

export function onBidAcceptedOrItemSold<T extends SoldParams>(params: T): void {
  if (isIgnoredToken(params.nft)) {
    return;
  }

  const listing = ensureListing(params.nft, params.tokenId, params.seller);
  const amount = params.quantity.toI32();

  // Listing was not created on Trove
  if (listing.status == "Unknown") {
    return;
  }

  listing.amount -= amount;

  // Bids can be accepted for an amount more than listed
  if (listing.amount < 1) {
    removeListing(params.nft, listing);
  } else {
    listing.save();
  }
}

function remove<T>(items: T[], item: T): T[] {
  const index = items.indexOf(item);

  return index == -1
    ? items
    : items.slice(0, index).concat(items.slice(index + 1));
}

export function removeListing(nft: Address, listing: Listing): void {
  if (isIgnoredToken(nft)) {
    return;
  }

  const config = getConfig();

  config.listings = remove(config.listings, listing.id);
  config.save();

  const user = ensureUser(Address.fromBytes(listing.user));

  user.listings = remove(user.listings, listing.id);
  user.save();

  store.remove("Listing", listing.id.toHexString());
}

export function ensureListingsAreActive(event: ethereum.Event): void {
  const config = getConfig();
  const listings = config.listings;
  const timestamp = event.block.timestamp.toI32();

  if (config.nextExpiresTimestamp > timestamp) {
    return;
  }

  config.nextExpiresTimestamp = timestamp + 300; // Every 5 minutes
  config.save();

  for (let index = 0; index < listings.length; index++) {
    const listing = Listing.load(listings[index]);

    // Shouldn't happen, but just in case
    if (!listing) {
      continue;
    }

    if (listing.expires < timestamp) {
      removeListing(Address.fromBytes(config.address), listing);
    }
  }
}
