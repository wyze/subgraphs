import { store } from "@graphprotocol/graph-ts";

import { ensureUser, isZero } from "@shared/helpers";

import { NameRegistered } from "../generated/Controller/TreasureTags";
import { NameRemoved, Transfer } from "../generated/Tags/TreasureTags";
import { ensureDomain, ensureToken } from "./lib/helpers";

export function onNameRegistered(event: NameRegistered): void {
  const params = event.params;
  const domain = ensureDomain(params.owner);

  domain.discriminant = params.discriminant;
  domain.name = params.name;

  domain.save();

  ensureUser(params.owner);
}

export function onNameRemoved(event: NameRemoved): void {
  const params = event.params;

  store.remove("Domain", params.owner.toHexString());
}

export function onTransfer(event: Transfer): void {
  const params = event.params;
  const token = ensureToken(params.tokenId);

  if (isZero(params.to)) {
    store.remove("Token", token.id.toHexString());

    return;
  }

  const user = ensureUser(params.to);

  token.owner = user.id;
  token.save();
}
