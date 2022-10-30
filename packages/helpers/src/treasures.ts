import { Address } from "@graphprotocol/graph-ts";

import {
  ADVANCED_QUESTING_ADDRESS,
  ASITERRA_NFT_HANDLER_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CRAFTING_ADDRESS,
  DEAD_ADDRESS,
  KAMEJI_NFT_HANDLER_ADDRESS,
  REALM_VAULT_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SHINOBA_NFT_HANDLER_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
  TREASURY_ADDRESS,
} from "@shared/constants";

const SINKS = [
  ADVANCED_QUESTING_ADDRESS,
  ASITERRA_NFT_HANDLER_ADDRESS,
  ATLAS_MINE_ADDRESS,
  CRAFTING_ADDRESS,
  KAMEJI_NFT_HANDLER_ADDRESS,
  REALM_VAULT_ADDRESS,
  SHINOBA_NFT_HANDLER_ADDRESS,
  TREASURY_ADDRESS,
  SEED_EVOLUTION_ADDRESS,
  SMOLOVE_FORGE_ADDRESS,
].map<string>((address) => address.toHexString());

export function isSink(address: Address, operator: Address): boolean {
  return changetype<boolean>(
    SINKS.includes(address.toHexString()) ||
      (SINKS.includes(operator.toHexString()) && address.equals(DEAD_ADDRESS))
  );
}
