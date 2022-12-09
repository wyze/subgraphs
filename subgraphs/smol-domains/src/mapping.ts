import { Address, Bytes } from "@graphprotocol/graph-ts";

import {
  DataChanged,
  DefaultDomainChanged,
  DomainCreated,
  SmolDomains,
  Transfer,
} from "../generated/Smol Domains/SmolDomains";
import { Domain, Token, User } from "../generated/schema";

function ensureDomain(name: string): Domain {
  const id = Bytes.fromUTF8(name);

  let domain = Domain.load(id);

  if (!domain) {
    domain = new Domain(id);

    domain.name = name;
  }

  return domain;
}

function ensureToken(tokenId: i32): Token {
  const id = Bytes.fromI32(tokenId);

  let token = Token.load(id);

  if (!token) {
    token = new Token(id);

    token.domain = Bytes.empty();
  }

  return token;
}

function ensureUser(id: Address): User {
  let user = User.load(id);

  if (!user) {
    user = new User(id);

    user.domains = [];
  }

  return user;
}

export function onDataChanged(event: DataChanged): void {
  const params = event.params;
  const user = ensureUser(params.user);
  const contract = SmolDomains.bind(event.address);

  for (let index = 0; index < user.domains.length; index++) {
    const token = Token.load(user.domains[index]);

    if (!token) {
      continue;
    }

    const domain = Domain.load(token.domain);

    if (!domain) {
      continue;
    }

    const data = contract.try_getDomainData(domain.name.replace(".smol", ""));

    if (data.reverted) {
      return;
    }

    const parts = data.value.split('"');
    const image = parts.indexOf("imgAddress");

    if (image == -1) {
      return;
    }

    const url = parts[image + 2];

    if (!url.includes("://")) {
      return;
    }

    // Found the change, save it and bail out of the loop
    if (domain.image != url) {
      domain.image = url;
      domain.save();

      return;
    }
  }
}

export function onDefaultDomainChanged(event: DefaultDomainChanged): void {
  const params = event.params;
  const domain = ensureDomain(`${params.defaultDomain}.smol`);
  const user = ensureUser(params.user);

  user.main = domain.id;
  user.save();
}

export function onDomainCreated(event: DomainCreated): void {
  const params = event.params;
  const user = ensureUser(params.owner);
  const domain = ensureDomain(params.fullDomainName);
  const token = Token.load(user.domains[user.domains.length - 1]);

  if (token) {
    domain.token = token.id;
    domain.save();

    token.domain = domain.id;
    token.save();
  }

  if (!user.main) {
    user.main = domain.id;
    user.save();
  }
}

export function onTransfer(event: Transfer): void {
  const params = event.params;
  const token = ensureToken(params.tokenId.toI32());

  token.save();

  if (params.from.notEqual(Address.zero())) {
    const fromUser = ensureUser(params.from);
    const index = fromUser.domains.indexOf(token.id);

    fromUser.domains = fromUser.domains
      .slice(0, index)
      .concat(fromUser.domains.slice(index + 1));
    fromUser.save();
  }

  const toUser = ensureUser(params.to);

  toUser.domains = toUser.domains.concat([token.id]);
  toUser.save();
}
