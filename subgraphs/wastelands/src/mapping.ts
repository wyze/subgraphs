import { Bytes, store } from "@graphprotocol/graph-ts";

import { createConfig, toTimestamp } from "@shared/helpers";
import { ensureListing, removeListing } from "@shared/trove";

import {
  ApprovalForAll,
  MagicRewardsClaimed,
  MagicRewardsToppedUp,
  Transfer,
} from "../generated/Wastelands/Wastelands";
import { DailyClaimable } from "../generated/schema";
import { MAX_TOKENS, ONE } from "./lib/constants";
import { ensureClaimed, ensureToken, ensureUser } from "./lib/helpers";

export * from "@shared/trove";

export function onApproval(event: ApprovalForAll): void {
  createConfig(event.address);
}

export function onRewardsClaimed(event: MagicRewardsClaimed): void {
  const amount = event.params.claimable.divDecimal(ONE);
  const claimed = ensureClaimed(event.params);

  claimed.amount = claimed.amount.plus(amount);
  claimed.save();
}

export function onRewardsToppedUp(event: MagicRewardsToppedUp): void {
  const amount = event.params.amount.divDecimal(ONE);
  const timestamp = toTimestamp(event.block.timestamp).daystamp;

  const claimable = new DailyClaimable(Bytes.fromI32(timestamp));

  claimable.amount = amount.div(MAX_TOKENS);
  claimable.day = timestamp;
  claimable.total = amount;
  claimable.save();
}

export function onTransfer(event: Transfer): void {
  const address = event.address;
  const params = event.params;

  const user = ensureUser(params.to);
  const token = ensureToken(params.tokenId);

  token.owner = user.id;
  token.save();

  const listing = ensureListing(address, params.tokenId, params.from);

  if (store.get("Listing", listing.id.toHexString())) {
    removeListing(address, listing);
  }
}
