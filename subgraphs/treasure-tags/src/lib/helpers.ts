import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { Domain, Token } from "../../generated/schema";

export function ensureDomain(id: Address): Domain {
  let domain = Domain.load(id);

  if (!domain) {
    domain = new Domain(id);
  }

  return domain;
}

export function ensureToken(tokenId: BigInt): Token {
  const id = Bytes.fromByteArray(Bytes.fromBigInt(tokenId));

  let token = Token.load(id);

  if (!token) {
    token = new Token(id);
  }

  return token;
}
