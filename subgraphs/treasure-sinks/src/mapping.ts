import { Address, BigInt, log } from "@graphprotocol/graph-ts";

import {
  ADVANCED_QUESTING_ADDRESS,
  ASITERRA_NFT_HANDLER_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CRAFTING_ADDRESS,
  DEAD_ADDRESS,
  KAMEJI_NFT_HANDLER_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SHINOBA_NFT_HANDLER_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
  TREASURY_ADDRESS,
} from "@shared/constants";

import { TransferBatch, TransferSingle } from "../generated/Treasure/ERC1155";
import { Sink, Token } from "../generated/schema";

const SINKS = [
  ADVANCED_QUESTING_ADDRESS,
  ASITERRA_NFT_HANDLER_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CRAFTING_ADDRESS,
  KAMEJI_NFT_HANDLER_ADDRESS,
  SHINOBA_NFT_HANDLER_ADDRESS,
  TREASURY_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
].map<string>((address) => address.toHexString());

function handleTransfer(
  fromAddress: Address,
  toAddress: Address,
  operatorAddress: Address,
  tokenId: BigInt,
  quantity: BigInt
): void {
  if (tokenId.toI32() == 0) {
    return;
  }

  const from = fromAddress.toHexString();
  const to = toAddress.toHexString();
  const operator = operatorAddress.toHexString();

  if (SINKS.includes(to)) {
    const token = getToken(to, tokenId);

    token.quantity += quantity.toI32();
    token.save();

    const sink = getSink(to);

    if (!sink.tokens.includes(token.id)) {
      sink.tokens = sink.tokens.concat([token.id]);
      sink.save();
    }
  }

  if (SINKS.includes(operator) && toAddress.equals(DEAD_ADDRESS)) {
    const token = getToken(operator, tokenId);

    token.quantity += quantity.toI32();
    token.save();

    const sink = getSink(operator);

    if (!sink.tokens.includes(token.id)) {
      sink.tokens = sink.tokens.concat([token.id]);
      sink.save();
    }
  }

  if (SINKS.includes(from)) {
    const token = getToken(from, tokenId);

    token.quantity -= quantity.toI32();
    token.save();
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  const params = event.params;

  for (let index = 0; index < params.ids.length; index++) {
    const id = params.ids[index];
    const value = params.values[index];

    handleTransfer(params.from, params.to, params.operator, id, value);
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  const params = event.params;

  handleTransfer(
    params.from,
    params.to,
    params.operator,
    params.id,
    params.value
  );
}

function getSink(address: string): Sink {
  let sink = Sink.load(address);

  if (!sink) {
    sink = new Sink(address);

    sink.name = getSinkName(address);
    sink.tokens = [];
  }

  return sink;
}

function getToken(address: string, tokenId: BigInt): Token {
  const id = `${address}-${tokenId.toHexString()}`;

  let token = Token.load(id);

  if (!token) {
    token = new Token(id);

    token.name = getTokenName(tokenId);
    token.quantity = 0;
    token.tokenId = tokenId;
  }

  return token;
}

function getSinkName(address: string): string {
  if (address == ADVANCED_QUESTING_ADDRESS.toHexString()) {
    return "Ivory Tower";
  }

  if (address == ASITERRA_NFT_HANDLER_ADDRESS.toHexString()) {
    return "Asiterra";
  }

  if (address == ATLAS_MINE_ADDRESS.toHexString()) {
    return "Atlas Mine";
  }

  if (address == CRAFTING_ADDRESS.toHexString()) {
    return "The Forge";
  }

  if (address == TREASURY_ADDRESS.toHexString()) {
    return "Broken";
  }

  if (address == KAMEJI_NFT_HANDLER_ADDRESS.toHexString()) {
    return "Kameji";
  }

  if (address == SHINOBA_NFT_HANDLER_ADDRESS.toHexString()) {
    return "Shinoba";
  }

  if (address == SEED_EVOLUTION_ADDRESS.toHexString()) {
    return "Seed Evolution";
  }

  if (address == SMOLOVE_FORGE_ADDRESS.toHexString()) {
    return "Smolove Forge";
  }

  log.error(`Sink name not handled: {}`, [address]);

  return "";
}

function getTokenName(tokenId: BigInt): string {
  const id = tokenId.toI32();

  switch (id) {
    case 39:
      return "Ancient Relic";
    case 46:
      return "Bag of Rare Mushrooms";
    case 47:
      return "Bait for Monsters";
    case 48:
      return "Beetle Wings";
    case 49:
      return "Blue Rupee";
    case 51:
      return "Bottomless Elixir";
    case 52:
      return "Cap of Invisibility";
    case 53:
      return "Carriage";
    case 54:
      return "Castle";
    case 68:
      return "Common Bead";
    case 69:
      return "Common Feather";
    case 70:
      return "Common Legion";
    case 71:
      return "Common Relic";
    case 72:
      return "Cow";
    case 73:
      return "Diamond";
    case 74:
      return "Divine Hourglass";
    case 75:
      return "Divine Mask";
    case 76:
      return "Donkey";
    case 77:
      return "Dragon Tail";
    case 79:
      return "Emerald";
    case 82:
      return "Favor from the Gods";
    case 91:
      return "Framed Butterfly";
    case 92:
      return "Gold Coin";
    case 93:
      return "Grain";
    case 94:
      return "Green Rupee";
    case 95:
      return "Grin";
    case 96:
      return "Half-Penny";
    case 97:
      return "Honeycomb";
    case 98:
      return "Immovable Stone";
    case 99:
      return "Ivory Breastpin";
    case 100:
      return "Jar of Fairies";
    case 103:
      return "Lumber";
    case 104:
      return "Military Stipend";
    case 105:
      return "Mollusk Shell";
    case 114:
      return "Ox";
    case 115:
      return "Pearl";
    case 116:
      return "Pot of Gold";
    case 117:
      return "Quarter-Penny";
    case 132:
      return "Red Feather";
    case 133:
      return "Red Rupee";
    case 141:
      return "Score of Ivory";
    case 151:
      return "Silver Coin";
    case 152:
      return "Small Bird";
    case 153:
      return "Snow White Feather";
    case 161:
      return "Thread of Divine Silk";
    case 162:
      return "Unbreakable Pocketwatch";
    case 164:
      return "Witches Broom";
    default:
      log.error(`Token name not handled: {}`, [id.toString()]);

      return "";
  }
}
