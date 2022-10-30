import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  store,
} from "@graphprotocol/graph-ts";

import {
  DEAD_ADDRESS,
  TREASURE_ADDRESS,
  TROVE_ADDRESS,
} from "@shared/constants";
import { isZero } from "@shared/helpers";

import * as ERC1155 from "../generated/Treasures/ERC1155";
import {
  BidAccepted,
  ItemCanceled,
  ItemListed,
  ItemSold,
  ItemUpdated,
} from "../generated/Trove/Trove";
import { Listing } from "../generated/schema";
import {
  ensureCollection,
  ensureListing,
  ensureUser,
  ensureUserToken,
} from "./helpers/entities";

class TransferParams {
  amount: BigInt;
  from: Address;
  id: BigInt;
  operator: Address;
  to: Address;
}

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

export function onApproval(event: ERC1155.ApprovalForAll): void {
  const params = event.params;

  if (params.approved) {
    return;
  }

  if (params.operator.notEqual(TROVE_ADDRESS)) {
    return;
  }

  const user = ensureUser(params.owner);
  const listings = user.listings;

  for (let index = 0; index < listings.length; index++) {
    const id = listings[index];

    if (!id.toHexString().startsWith(event.address.toHexString())) {
      continue;
    }

    const listing = Listing.load(id);

    if (!listing) {
      continue;
    }

    listing.status = "Inactive";
    listing.save();
  }
}

function onTransfer<T extends TransferParams>(
  contract: Address,
  params: T
): void {
  const amount = params.amount.toI32();

  if (params.id.isZero()) {
    return;
  }

  if (!isZero(params.from)) {
    const userToken = ensureUserToken(contract, params.id, params.from);

    userToken.amount -= amount;
    userToken.save();
  }

  if (!isZero(params.to) && params.to.notEqual(DEAD_ADDRESS)) {
    const userToken = ensureUserToken(contract, params.id, params.to);

    userToken.amount += amount;
    userToken.save();
  }
}

export function onTransferBatch(event: ERC1155.TransferBatch): void {
  if (isIgnoredToken(event.address)) {
    ensureListingsAreActive(event);

    return;
  }

  const params = event.params;
  const amounts = params.amounts;
  const from = params.from;
  const ids = params.ids;
  const operator = params.operator;
  const to = params.to;

  for (let index = 0; index < ids.length; index++) {
    const amount = amounts[index];
    const id = ids[index];

    onTransfer<TransferParams>(event.address, {
      amount,
      from,
      id,
      operator,
      to,
    });
  }

  ensureListingsAreActive(event);
}

export function onTransferSingle(event: ERC1155.TransferSingle): void {
  if (isIgnoredToken(event.address)) {
    ensureListingsAreActive(event);

    return;
  }

  onTransfer(event.address, event.params);
  ensureListingsAreActive(event);
}

function isIgnoredToken(contract: Address): boolean {
  return contract.notEqual(TREASURE_ADDRESS);
}

function ensureListingsAreActive(event: ethereum.Event): void {
  const collection = ensureCollection(TREASURE_ADDRESS);
  const listings = collection.listings;
  const timestamp = event.block.timestamp.toI32();

  if (collection.nextExpiresTimestamp > timestamp) {
    return;
  }

  collection.nextExpiresTimestamp = timestamp + 300; // Every 5 minutes
  collection.save();

  for (let index = 0; index < listings.length; index++) {
    const listing = Listing.load(listings[index]);

    // Shouldn't happen, but just in case
    if (!listing) {
      continue;
    }

    if (listing.expires < timestamp) {
      removeListing(Address.fromBytes(collection.id), listing);
    }
  }
}

export function onBidAccepted(event: BidAccepted): void {
  onBidAcceptedOrItemSold(event.params);
  ensureListingsAreActive(event);
}

export function onItemCanceled(event: ItemCanceled): void {
  const params = event.params;

  // For now, only worry about Treasures
  if (isIgnoredToken(params.nft)) {
    ensureListingsAreActive(event);

    return;
  }

  const listing = ensureListing(params.nft, params.tokenId, params.seller);

  if (listing.status == "Unknown") {
    return;
  }

  removeListing(params.nft, listing);
  ensureListingsAreActive(event);
}

export function onItemListed(event: ItemListed): void {
  ensureListingsAreActive(event);
  onItemListedOrUpdated(event.params);
}

export function onItemSold(event: ItemSold): void {
  onBidAcceptedOrItemSold(event.params);
  ensureListingsAreActive(event);
}

export function onItemUpdated(event: ItemUpdated): void {
  ensureListingsAreActive(event);
  onItemListedOrUpdated(event.params);
}

function onItemListedOrUpdated<T extends ListedParams>(params: T): void {
  // For now, only worry about Treasures
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
  listing.user = params.seller;

  listing.save();

  const collection = ensureCollection(params.nft);

  if (!collection.listings.includes(listing.id)) {
    collection.listings = collection.listings.concat([listing.id]);
    collection.save();
  }

  const user = ensureUser(params.seller);

  if (!user.listings.includes(listing.id)) {
    user.listings = user.listings.concat([listing.id]);
    user.save();
  }
}

function onBidAcceptedOrItemSold<T extends SoldParams>(params: T): void {
  // For now, only worry about Treasures
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

function removeListing(nft: Address, listing: Listing): void {
  const collection = ensureCollection(nft);

  collection.listings = remove(collection.listings, listing.id);
  collection.save();

  const user = ensureUser(Address.fromBytes(listing.user));

  user.listings = remove(user.listings, listing.id);
  user.save();

  store.remove("Listing", listing.id.toHexString());
}
