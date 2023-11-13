import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { ONE } from "@shared/constants";
import { isZero } from "@shared/helpers";

import { Transfer } from "../generated/Legions/ERC721";
import {
  Upgraded,
  WanderingMerchantActiveTimeChanged,
  WanderingMerchantRecipeAdded,
  WanderingMerchantRecipeAdded1,
  WanderingMerchantRecipeFulfilled,
  WanderingMerchantRecipeRemoved,
} from "../generated/Meem/Meem";
import {
  Burn,
  Merchant,
  Output,
  Recipe,
  Trade,
  User,
} from "../generated/schema";

const OUTPUT_TYPES = ["Consumable", "Erc20", "Erc1155"];

function ensureBurn(): Burn {
  const id = Bytes.fromUTF8("burn");

  let burn = Burn.load(id);

  if (!burn) {
    burn = new Burn(id);

    burn.tokenIds = new Array<i32>();
    burn.save();
  }

  return burn;
}

function ensureMerchant(address: Address): Merchant {
  let merchant = Merchant.load(address);

  if (!merchant) {
    merchant = new Merchant(address);

    merchant.closeTime = 0;
    merchant.openTime = 0;
    merchant.version = 0;
  }

  return merchant;
}

function formatAmount(amount: BigInt): i32 {
  return amount.gt(BigInt.fromI32(100000))
    ? BigInt.fromString(amount.divDecimal(ONE).toString()).toI32()
    : amount.toI32();
}

function formatTime(time: BigInt): i32 {
  const length = time.toString().length;

  return length <= 10
    ? time.toI32()
    : BigInt.fromString(time.toString().slice(0, -3)).toI32();
}

function getInput(inputType: i32): string {
  switch (inputType) {
    case 0:
      return "Consumable";
    case 1:
      return "AuxLegion";
    case 2:
      return "Corruption";
    case 3:
      return "Keys";
    default:
      return "Unknown";
  }
}

function getRecipeId(address: Address, recipeId: BigInt): Bytes {
  const merchant = ensureMerchant(address);

  return Bytes.fromI32(recipeId.toI32()).concatI32(merchant.version);
}

export function onActiveTimeChanged(
  event: WanderingMerchantActiveTimeChanged
): void {
  const params = event.params;

  const merchant = ensureMerchant(event.address);

  merchant.closeTime = formatTime(params.closeTime);
  merchant.openTime = formatTime(params.openTime);

  merchant.save();
}

export function onRecipeAddedV1(event: WanderingMerchantRecipeAdded): void {
  const params = event.params;
  const id = getRecipeId(event.address, params.recipeId);
  const inputType = params.inputType;
  const outputs = params.outputs;

  const recipe = new Recipe(id);

  recipe.available = params.maxAvailable.toI32();
  recipe.createdAt = event.block.timestamp.toI32();
  recipe.input = getInput(inputType);
  recipe.inputTokenId = params.inputTokenId.toI32();
  recipe.inputAmount = 1;

  recipe.save();

  for (let index = 0; index < outputs.length; index++) {
    const id = recipe.id.concatI32(index);
    const output = new Output(id);
    const outputType = outputs[index].outputType;
    const amount = outputs[index].amount;

    output.address = outputs[index].outputAddress;
    output.amount = amount.gt(BigInt.fromI32(1000))
      ? BigInt.fromString(
          amount.divDecimal(BigDecimal.fromString(`${1e18}`)).toString()
        ).toI32()
      : amount.toI32();
    output.from = outputs[index].transferredFrom;
    output.recipe = recipe.id;
    output.tokenId = outputs[index].tokenId.toI32();
    output.type = outputType > 1 ? "Unknown" : OUTPUT_TYPES[outputType];

    output.save();
  }
}

export function onRecipeAddedV2(event: WanderingMerchantRecipeAdded1): void {
  const params = event.params;
  const id = getRecipeId(event.address, params.recipeId);
  const inputType = params.inputType;
  const outputs = params.outputs;

  const recipe = new Recipe(id);

  recipe.available = params.maxAvailable.toI32();
  recipe.createdAt = event.block.timestamp.toI32();
  recipe.input = getInput(inputType);
  recipe.inputTokenId = params.inputTokenId.toI32();
  recipe.inputAmount = formatAmount(params.inputAmount);

  recipe.save();

  const length = outputs.length;

  for (let index = 0; index < length; index++) {
    const id = recipe.id.concatI32(index);
    const output = new Output(id);
    const outputType = outputs[index].outputType;

    output.address = outputs[index].outputAddress;
    output.amount = formatAmount(outputs[index].amount);
    output.from = outputs[index].transferredFrom;
    output.recipe = recipe.id;
    output.tokenId = outputs[index].tokenId.toI32();
    output.type = outputType > 2 ? "Unknown" : OUTPUT_TYPES[outputType];

    output.save();
  }
}

export function onRecipeFulfilled(
  event: WanderingMerchantRecipeFulfilled
): void {
  const params = event.params;
  const recipeId = getRecipeId(event.address, params.recipeId);
  const timestamp = event.block.timestamp.toI32();
  const id = params.user
    .concat(recipeId)
    .concatI32(timestamp)
    .concatI32(event.transactionLogIndex.toI32());

  if (!User.load(params.user)) {
    new User(params.user).save();
  }

  const trade = new Trade(id);

  trade.recipe = recipeId;
  trade.timestamp = timestamp;
  trade.user = params.user;

  const recipe = Recipe.load(recipeId);

  if (recipe && recipe.input == "AuxLegion") {
    const burn = ensureBurn();

    trade.legionBurned = burn.tokenIds[0];

    burn.tokenIds = burn.tokenIds.slice(1);
    burn.save();
  }

  trade.save();
}

export function onRecipeRemoved(event: WanderingMerchantRecipeRemoved): void {
  let recipe = Recipe.load(getRecipeId(event.address, event.params.recipeId));

  if (recipe) {
    recipe.removedAt = event.block.timestamp.toI32();
    recipe.save();
  }
}

export function onTransfer(event: Transfer): void {
  if (!isZero(event.params.to)) {
    return;
  }

  const burn = ensureBurn();

  burn.tokenIds = burn.tokenIds.concat([event.params.tokenId.toI32()]);
  burn.save();
}

export function onUpgraded(event: Upgraded): void {
  const merchant = ensureMerchant(event.address);

  merchant.version += 1;
  merchant.save();
}
