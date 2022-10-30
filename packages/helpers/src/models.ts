import { Address, BigDecimal, Value, store, Bytes } from "@graphprotocol/graph-ts";

import { TREASURE_ADDRESS } from "@shared/constants";

import { Token } from "./entities";
import {
  getTreasureBoost,
  getTreasureCategory,
  getTreasureName,
  getTreasureTier,
} from "./metadata";

function exists(entity: string, id: string): boolean {
  return store.get(entity, id) != null;
}

export function getToken(address: Address, tokenId: i32): Token {
  switch (true) {
    case address.equals(TREASURE_ADDRESS):
      return getTreasureToken(tokenId);
    default:
      return new Token(-1);
  }
}

function getTreasureToken(tokenId: i32): Token {
  const token = new Token(tokenId);

  if (exists("Token", token.id.toHexString())) {
    return token;
  }

  // All tokens share this
  // token.tokenId = tokenId;

  // Set specific token information
  token.set(
    "boost",
    Value.fromBigDecimal(BigDecimal.fromString(getTreasureBoost(tokenId)))
  );
  token.set("category", Value.fromString(getTreasureCategory(tokenId)));
  token.set(
    "image",
    Value.fromString(
      `ipfs://Qmd1hsvPDWrxtnfUna3pQyfmChyAkMenuziHS1gszM34P8/Treasures/${tokenId}.jpg`
    )
  );
  token.set("name", Value.fromString(getTreasureName(tokenId)));
  token.set("tier", Value.fromI32(getTreasureTier(tokenId)));

  // Save changes
  token.save();

  return token;
}
