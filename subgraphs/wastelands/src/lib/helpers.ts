import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { MagicRewardsClaimed__Params } from "../../generated/Wastelands/Wastelands";
import { Claimed, Token, User } from "../../generated/schema";

export function ensureClaimed(params: MagicRewardsClaimed__Params): Claimed {
  const id = Bytes.empty();

  let claimed = Claimed.load(id);

  if (!claimed) {
    claimed = new Claimed(id);

    claimed.amount = BigDecimal.zero();
    claimed.token = ensureToken(params.tokenId).id;
    claimed.user = ensureUser(params.user).id;
  }

  return claimed;
}

export function ensureToken(biTokenId: BigInt): Token {
  const tokenId = biTokenId.toI32();
  const id = Bytes.fromI32(tokenId);

  let token = Token.load(id);

  if (!token) {
    token = new Token(id);

    token.tokenId = tokenId;
  }

  return token;
}

export function ensureUser(id: Address): User {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
    user.save();
  }

  return user;
}
