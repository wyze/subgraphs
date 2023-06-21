import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  Value,
  ethereum,
  store,
} from "@graphprotocol/graph-ts";

import {
  BALANCER_CRYSTAL_ADDRESS,
  CONSUMABLE_ADDRESS,
  TREASURE_ADDRESS,
  TREASURE_FRAGMENT_ADDRESS,
} from "@shared/constants";

import {
  Config,
  StakedToken,
  Token,
  Transfer,
  User,
  UserToken,
} from "./entities";
import { getId } from "./ids";
import {
  getBalancerCrystalName,
  getConsumableName,
  getConsumableSize,
  getConsumableType,
  getFragmentCategories,
  getFragmentName,
  getFragmentTier,
  getTreasureBoost,
  getTreasureCategory,
  getTreasureName,
  getTreasureTier,
} from "./metadata";
import { toTimestamp } from "./numbers";
import { TransferParams } from "./types";

function exists(entity: string, id: string): boolean {
  return store.get(entity, id) != null;
}

function toBigIntBytes(value: BigInt): Bytes {
  return Bytes.fromByteArray(Bytes.fromBigInt(value));
}

export function createConfig(address: Address): void {
  if (!Config.load()) {
    const config = new Config();

    config.address = address;
    config.ignoredTokens = [];
    config.listings = [];
    config.nextExpiresTimestamp = 0;

    if (address.equals(TREASURE_ADDRESS)) {
      config.ignoredTokens = [0];
    }

    config.save();
  }
}

export function ensureStakedToken(
  contract: Address,
  tokenId: BigInt,
  user: Address,
  sink: Address
): StakedToken {
  const tokenEntityId = sink.concat(contract).concat(toBigIntBytes(tokenId));
  const id = tokenEntityId.concat(user);

  let stakedToken = StakedToken.load(id);

  if (!stakedToken) {
    stakedToken = new StakedToken(id);

    stakedToken.amount = 0;
    stakedToken.sink = sink;
    stakedToken.token = getToken(contract, tokenId.toI32()).id;
    stakedToken.user = ensureUser(user).id;
  }

  return stakedToken;
}

export function ensureUser(wallet: Address): User {
  let user = User.load(wallet);

  if (!user) {
    user = new User(wallet);

    user.save();
  }

  return user;
}

export function ensureUserToken(
  contract: Address,
  tokenId: BigInt,
  user: Address
): UserToken {
  const tokenEntityId = contract.concat(toBigIntBytes(tokenId));
  const id = tokenEntityId.concat(user);

  let userToken = UserToken.load(id);

  if (!userToken) {
    userToken = new UserToken(id);

    userToken.amount = 0;
    userToken.token = getToken(contract, tokenId.toI32()).id;
    userToken.user = ensureUser(user).id;
  }

  return userToken;
}

export function ensureTransfer(
  event: ethereum.Event,
  params: TransferParams
): Transfer {
  const transfer = new Transfer(getId(event));
  const block = event.block;

  transfer.amount = params.amount;
  transfer.blockNumber = block.number.toI32();
  transfer.blockTimestamp = toTimestamp(block.timestamp).timestamp;
  transfer.from = params.from;
  transfer.operator = params.operator;
  transfer.to = params.to;

  return transfer;
}

export function getConfig(): Config {
  let config = Config.load();

  if (!config) {
    config = new Config();

    config.address = Address.zero();
    config.nextExpiresTimestamp = i32.MAX_VALUE;
  }

  return config;
}

function getBalancerCrystalToken(tokenId: i32): Token {
  const token = new Token(tokenId);

  if (exists("Token", token.id.toHexString())) {
    return token;
  }

  // Set specific token information
  token.set(
    "image",
    Value.fromString(
      `ipfs://Qmd1hsvPDWrxtnfUna3pQyfmChyAkMenuziHS1gszM34P8/Balancer%20Crystal/${tokenId}.jpg`
    )
  );
  token.set("name", Value.fromString(getBalancerCrystalName(tokenId)));

  // Save changes
  token.save();

  return token;
}

function getConsumableToken(tokenId: i32): Token {
  const token = new Token(tokenId);

  if (exists("Token", token.id.toHexString())) {
    return token;
  }

  const size = getConsumableSize(tokenId);

  // Set specific token information
  token.set(
    "image",
    Value.fromString(
      `ipfs://Qma82rv8QoVuBkWUcovNcDbxHFaCEGrNHr5XtmdvKE4W98/Consumables/${tokenId}.jpg`
    )
  );
  token.set("name", Value.fromString(getConsumableName(tokenId)));

  if (size != "") {
    token.set("size", Value.fromString(size));
  }

  token.set("type", Value.fromString(getConsumableType(tokenId)));

  // Save changes
  token.save();

  return token;
}

function getFragmentToken(tokenId: i32): Token {
  const token = new Token(tokenId);

  if (exists("Token", token.id.toHexString())) {
    return token;
  }

  // Set specific token information
  token.set(
    "categories",
    Value.fromStringArray(getFragmentCategories(tokenId))
  );
  token.set(
    "image",
    Value.fromString(
      `ipfs://QmUv5UT7X9qahf8bqcqZjX7TKqrJeMyRX3kxjVowz2WkRm/${tokenId}.jpg`
    )
  );
  token.set("name", Value.fromString(getFragmentName(tokenId)));
  token.set("tier", Value.fromI32(getFragmentTier(tokenId)));
  token.set("tokenId", Value.fromI32(tokenId));

  // Save changes
  token.save();

  return token;
}

export function getToken(address: Address, tokenId: i32): Token {
  switch (true) {
    case address.equals(BALANCER_CRYSTAL_ADDRESS):
      return getBalancerCrystalToken(tokenId);
    case address.equals(CONSUMABLE_ADDRESS):
      return getConsumableToken(tokenId);
    case address.equals(TREASURE_FRAGMENT_ADDRESS):
      return getFragmentToken(tokenId);
    case address.equals(TREASURE_ADDRESS):
      return getTreasureToken(tokenId);
    default:
      return new Token(tokenId);
  }
}

function getTreasureToken(tokenId: i32): Token {
  const token = new Token(tokenId);

  if (exists("Token", token.id.toHexString())) {
    return token;
  }

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
