import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import {
  WanderingMerchantActiveTimeChanged,
  WanderingMerchantRecipeAdded,
  WanderingMerchantRecipeFulfilled,
} from "../generated/Meem/Meem";
import { Merchant, Output, Recipe, Trade, User } from "../generated/schema";

const INPUT_TYPES = ["Consumable", "AuxLegion"];
const OUTPUT_TYPES = ["Consumable", "Erc20"];

export function onActiveTimeChanged(
  event: WanderingMerchantActiveTimeChanged
): void {
  const params = event.params;

  let merchant = Merchant.load(event.address);

  if (!merchant) {
    merchant = new Merchant(event.address);
  }

  merchant.closeTime = params.closeTime.toI32();
  merchant.openTime = params.openTime.toI32();

  merchant.save();
}

export function onRecipeAdded(event: WanderingMerchantRecipeAdded): void {
  const params = event.params;
  const id = Bytes.fromI32(params.recipeId.toI32());
  const inputType = params.inputType;
  const outputs = params.outputs;

  const recipe = new Recipe(id);

  recipe.available = params.maxAvailable.toI32();
  recipe.input = inputType > 1 ? "Unknown" : INPUT_TYPES[inputType];
  recipe.inputTokenId = params.inputTokenId.toI32();

  recipe.save();

  for (let index = 0; index < outputs.length; index++) {
    const id = recipe.id.concat(Bytes.fromI32(index));
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

export function onRecipeFulfilled(
  event: WanderingMerchantRecipeFulfilled
): void {
  const params = event.params;
  const recipeId = Bytes.fromI32(params.recipeId.toI32());
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

  trade.save();
}
