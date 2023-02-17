import { store } from "@graphprotocol/graph-ts";

import { createConfig, ensureStake, getConfig, isStake } from "@shared/helpers";
import { ensureListing, removeListing } from "@shared/trove";

import { Token } from "./src/entities";
import { ApprovalForAll, Transfer } from "./src/events";

function ensureToken(event: Transfer): Token {
  const id = event.params.tokenId.toI32();

  let token = Token.load(id);

  if (!token) {
    token = new Token(id);

    token.tokenId = id;
  }

  return token;
}

export function onApproval(event: ApprovalForAll): void {
  createConfig(event.address);
}

export function onTransfer(event: Transfer): void {
  const address = event.address;
  const params = event.params;
  const from = params.from;
  const to = params.to;
  const tokenId = params.tokenId;

  createConfig(event.address);

  if (getConfig().ignoredTokens.includes(tokenId.toI32())) {
    return;
  }

  ensureStake(to);

  const token = ensureToken(event);

  if (!isStake(to)) {
    token.location = null;
    token.owner = to;

    const listing = ensureListing(address, tokenId, from);

    if (store.get("Listing", listing.id.toHexString())) {
      removeListing(address, listing);
    }
  } else {
    token.location = to;
  }

  token.save();
}
