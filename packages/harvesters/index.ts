import { Stake } from "./src/entities";
import { HarvesterDeployed } from "./src/events";

export function onHarvesterDeployed(event: HarvesterDeployed): void {
  new Stake(event.params.nftHandler).save();
}
