import {
  BidAccepted,
  ItemCanceled,
  ItemListed,
  ItemSold,
  ItemUpdated,
} from "./src/events";
import {
  ensureListingsAreActive,
  onBidAcceptedOrItemSold,
  onItemListedOrUpdated,
  removeListing,
} from "./src/listings";
import { ensureListing } from "./src/models";
import { isIgnoredToken } from "./src/token";

export { ensureListing, removeListing };

export function onBidAccepted(event: BidAccepted): void {
  onBidAcceptedOrItemSold(event.params);
  ensureListingsAreActive(event);
}

export function onItemCanceled(event: ItemCanceled): void {
  const params = event.params;

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
