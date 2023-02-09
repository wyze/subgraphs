import {
  BigDecimal,
  BigInt,
  DataSourceContext,
  dataSource,
  store,
} from "@graphprotocol/graph-ts";

import {
  ATLAS_MINE_ADDRESS,
  BURN_ADDRESS,
  CONSUMABLE_ADDRESS,
  MAGIC_ADDRESS,
  MASTER_OF_COIN_ADDRESS,
  MIDDLEMAN_ADDRESS,
} from "@shared/constants";
import { toTimestamp } from "@shared/helpers";

import { HarvesterDeployed } from "../generated/Harvester Factory/HarvesterFactory";
import { Emission } from "../generated/schema";
import {
  ExtractorRules,
  Harvester,
  HarvesterConfig,
  Magic,
  NftHandler,
  NftHandlerConfig,
} from "../generated/templates";
import {
  ExtractorReplaced,
  ExtractorStaked,
} from "../generated/templates/ExtractorRules/ExtractorRules";
import {
  Deposit,
  Harvest,
  TimelockOption,
  TimelockOptionDisabled,
  TimelockOptionEnabled,
  Withdraw,
} from "../generated/templates/Harvester/Harvester";
import { Transfer } from "../generated/templates/Magic/ERC20";
import { MasterOfCoin } from "../generated/templates/Magic/MasterOfCoin";
import { Middleman } from "../generated/templates/Magic/Middleman";
import {
  NftConfigSet,
  Staked,
  Unstaked,
} from "../generated/templates/NftHandler/NftHandler";
import {
  DAY,
  EXTRACTOR_BOOSTS,
  EXTRACTOR_LIFETIME,
  EXTRACTOR_SIZE,
  EXTRACTOR_TOKEN_IDS,
  NAMES,
  ONE,
  ONE_HOUR,
} from "./lib/constants";
import {
  ensureDailyExtractor,
  ensureDailyHarvester,
  ensureDailyTimelock,
  ensureDeposit,
  ensureDepositById,
  ensureDepositUnlock,
  ensureExtractor,
  ensureHarvester,
  ensureReward,
  ensureStakedToken,
  ensureTimelock,
  ensureTimelockById,
  ensureUnlock,
  ensureUser,
  ensureWithdrawal,
} from "./lib/helpers";

export function onAddedTimelockOption(event: TimelockOption): void {
  const address = event.address;
  const params = event.params;
  const timelock = ensureTimelock(event.address, params.id);

  timelock.boost = params.timelock.boost.divDecimal(ONE);
  timelock.duration = params.timelock.timelock.toI32();
  timelock.enabled = params.timelock.enabled;
  timelock.harvester = address;
  timelock.vesting = params.timelock.vesting.toI32();

  timelock.save();
}

export function onDisabledTimelockOption(event: TimelockOptionDisabled): void {
  const timelock = ensureTimelock(event.address, event.params.id);

  timelock.enabled = false;
  timelock.save();
}

export function onEnabledTimelockOption(event: TimelockOptionEnabled): void {
  if (
    !store.get(
      "Timelock",
      event.address.concatI32(event.params.id.toI32()).toHexString()
    )
  ) {
    return;
  }

  const timelock = ensureTimelock(event.address, event.params.id);

  timelock.enabled = true;
  timelock.save();
}

export function onHarvesterDeployed(event: HarvesterDeployed): void {
  const params = event.params;

  // Create Harvester entity
  const harvester = ensureHarvester(params.harvester);

  harvester.handler = params.nftHandler;

  harvester.save();

  const context = new DataSourceContext();

  context.setBytes("harvester", params.harvester);

  // Start listening for Harvester events at this address
  Harvester.create(params.harvester);
  HarvesterConfig.create(params.harvester);

  // Start listening for NftHandler events at this address
  NftHandler.create(params.nftHandler);
  NftHandlerConfig.createWithContext(params.nftHandler, context);

  // Start listening to transfer events to calculate emissions
  Magic.create(MAGIC_ADDRESS);
}

export function onNftConfigSet(event: NftConfigSet): void {
  const params = event.params;
  const nft = params.nft;
  const tokenId = params.tokenId;

  if (nft.equals(CONSUMABLE_ADDRESS)) {
    // Check Consumable token ID
    if (EXTRACTOR_TOKEN_IDS.includes(tokenId)) {
      ExtractorRules.createWithContext(
        params.config.stakingRules,
        dataSource.context()
      );
    }
  }
}

export function onDeposit(event: Deposit): void {
  const address = event.address;
  const params = event.params;
  const timelock = ensureTimelock(address, params.lock);
  const timestamp = event.block.timestamp;

  const daily = ensureDailyTimelock(timelock, timestamp);
  const deposit = ensureDeposit(address, params);
  const user = ensureUser(params.user);

  deposit.day = daily.id;
  deposit.save();

  daily.depositCount += 1;
  daily.deposited = daily.deposited.plus(params.amount.divDecimal(ONE));
  daily.save();

  if (timelock.vesting) {
    const amount = params.amount.divDecimal(
      BigDecimal.fromString(`${timelock.vesting * 1e18}`)
    );

    for (let index = 0; index < timelock.vesting; index++) {
      const blockstamp = timestamp.plus(BigInt.fromI32(DAY * index));
      const unlock = ensureUnlock(blockstamp, timelock);

      unlock.amount = unlock.amount.plus(amount);
      unlock.save();

      const depositUnlock = ensureDepositUnlock(user, deposit, unlock);

      depositUnlock.amount = amount;
      depositUnlock.save();

      const daily = ensureDailyTimelock(timelock, blockstamp);

      daily.unlockCounts += 1;
      daily.unlocked = daily.unlocked.plus(amount);
      daily.save();
    }
  } else {
    const amount = params.amount.divDecimal(ONE);
    const unlock = ensureUnlock(timestamp, timelock);

    unlock.amount = unlock.amount.plus(amount);
    unlock.save();

    const depositUnlock = ensureDepositUnlock(user, deposit, unlock);

    depositUnlock.amount = amount;
    depositUnlock.save();

    const daily = ensureDailyTimelock(
      timelock,
      timestamp.plus(BigInt.fromI32(timelock.duration))
    );

    daily.unlockCounts += 1;
    daily.unlocked = daily.unlocked.plus(amount);
    daily.save();
  }
}

export function onHarvest(event: Harvest): void {
  const address = event.address;
  const params = event.params;
  const amount = params.amount.divDecimal(ONE);

  const daily = ensureDailyHarvester(address, event.block.timestamp);
  const reward = ensureReward(address, params);

  reward.amount = reward.amount.plus(amount);
  reward.day = daily.id;
  reward.save();

  daily.harvestCount += 1;
  daily.harvested = daily.harvested.plus(amount);
  daily.save();
}

export function onWithdraw(event: Withdraw): void {
  const params = event.params;
  const amount = params.amount.divDecimal(ONE);

  const withdrawal = ensureWithdrawal(event.address, params);
  const deposit = ensureDepositById(withdrawal.id);
  const timelock = ensureTimelockById(deposit.timelock);
  const daily = ensureDailyTimelock(timelock, event.block.timestamp);

  withdrawal.amount = amount;
  withdrawal.day = daily.id;
  withdrawal.id = withdrawal.id.concat(event.transaction.hash);
  withdrawal.save();

  daily.withdrawalCounts += 1;
  daily.withdrawn = daily.withdrawn.plus(amount);
  daily.save();
}

export function onStaked(event: Staked): void {
  const params = event.params;

  // Extractors will be handled separately because they require the spotId param
  if (
    params.nft.equals(CONSUMABLE_ADDRESS) &&
    EXTRACTOR_TOKEN_IDS.includes(params.tokenId)
  ) {
    return;
  }

  const stakedToken = ensureStakedToken(
    event.address,
    params.user,
    params.nft,
    params.tokenId.toI32()
  );

  stakedToken.amount += params.amount.toI32();
  stakedToken.save();
}

export function onTransfer(event: Transfer): void {
  const timestamp = toTimestamp(event.block.timestamp);
  const atlasMineId = ATLAS_MINE_ADDRESS.concatI32(timestamp.hourstamp);

  if (store.get("Emission", atlasMineId.toHexString())) {
    return;
  }

  const masterOfCoin = MasterOfCoin.bind(MASTER_OF_COIN_ADDRESS);
  const middleman = Middleman.bind(MIDDLEMAN_ADDRESS);

  const rate = masterOfCoin.try_getRatePerSecond(MIDDLEMAN_ADDRESS);
  const harvesterShares = middleman.try_getHarvesterShares(BURN_ADDRESS);

  if (rate.reverted || harvesterShares.reverted) {
    return;
  }

  const addresses = harvesterShares.value.getAllActiveHarvesters();
  const shares = harvesterShares.value.getHarvesterShare();
  const totalShare = harvesterShares.value.getTotalShare();

  for (let index = 0; index < addresses.length; index++) {
    const address = addresses[index];
    const share = shares[index];

    const emissionsShare = share.divDecimal(totalShare.toBigDecimal());
    const emission = new Emission(address.concatI32(timestamp.hourstamp));

    emission.address = address;
    emission.day = timestamp.daystamp;
    emission.emissionsPerSecond = rate.value
      .divDecimal(ONE)
      .times(emissionsShare);
    emission.emissionsShare = emissionsShare;
    emission.miningPower = share.divDecimal(ONE);
    emission.hour = timestamp.hourstamp;
    emission.name = NAMES.mustGet(address.toHexString());

    emission.save();
  }
}

export function onUnstaked(event: Unstaked): void {
  const params = event.params;

  const stakedToken = ensureStakedToken(
    event.address,
    params.user,
    params.nft,
    params.tokenId.toI32()
  );
  stakedToken.amount -= params.amount.toI32();

  if (stakedToken.amount > 0) {
    stakedToken.save();
  } else {
    store.remove("StakedToken", stakedToken.id.toHexString());
  }
}

export function onExtractorStaked(event: ExtractorStaked): void {
  const harvester = dataSource.context().getBytes("harvester");
  const params = event.params;
  const amount = params.amount.toI32();
  const index = EXTRACTOR_TOKEN_IDS.indexOf(params.tokenId);
  const timestamp = event.block.timestamp;

  // Only one event is fired for multiple Extractors staked
  // Determine the starting spotId by subtracting the amount from the event's spotId
  const endSpotId = params.spotId.toI32();
  const startSpotId = endSpotId - (amount - 1);

  for (let spotId = startSpotId; spotId <= endSpotId; spotId++) {
    const extractor = ensureExtractor(harvester, spotId, timestamp);

    extractor.boost = EXTRACTOR_BOOSTS[index];
    extractor.expires = timestamp.plus(EXTRACTOR_LIFETIME);
    extractor.tokenId = params.tokenId.toI32();
    extractor.user = params.user;

    extractor.save();
  }
}

export function onExtractorReplaced(event: ExtractorReplaced): void {
  const harvester = dataSource.context().getBytes("harvester");
  const params = event.params;
  const index = EXTRACTOR_TOKEN_IDS.indexOf(params.tokenId);
  const timestamp = event.block.timestamp;

  const extractor = ensureExtractor(
    harvester,
    params.replacedSpotId.toI32(),
    timestamp
  );

  extractor.boost = EXTRACTOR_BOOSTS[index];
  extractor.expires = timestamp.plus(EXTRACTOR_LIFETIME);
  extractor.tokenId = params.tokenId.toI32();
  extractor.user = params.user;

  extractor.save();
}
