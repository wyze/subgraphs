import { Address, store } from "@graphprotocol/graph-ts";

import {
  ADVANCED_QUESTING_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CORRUPTION_CRYPTS_ADDRESS,
  CRAFTING_ADDRESS,
  DEAD_ADDRESS,
  REALM_VAULT_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
  SUMMONING_ADDRESS,
  TREASURY_ADDRESS,
} from "@shared/constants";

import { Stake } from "./entities";

const BURNS = [
  REALM_VAULT_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
  TREASURY_ADDRESS,
].map<string>((address) => address.toHexString());

const STAKES = [
  ADVANCED_QUESTING_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CRAFTING_ADDRESS,
  CORRUPTION_CRYPTS_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SUMMONING_ADDRESS,
].map<string>((address) => address.toHexString());

export function ensureStake(address: Address): void {
  if (!isStake(address) && STAKES.includes(address.toHexString())) {
    new Stake(address).save();
  }
}

export function isBurn(address: Address, operator: Address): boolean {
  return changetype<boolean>(
    BURNS.includes(address.toHexString()) ||
      (BURNS.includes(operator.toHexString()) && address.equals(DEAD_ADDRESS))
  );
}

export function isSink(address: Address, operator: Address): boolean {
  return isBurn(address, operator) || isStake(address);
}

export function isStake(address: Address): boolean {
  return store.get("Stake", address.toHexString()) !== null;
}
