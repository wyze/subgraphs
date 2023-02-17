import { Address, ethereum } from "@graphprotocol/graph-ts";

export class HarvesterDeployed extends ethereum.Event {
  get params(): HarvesterDeployed__Params {
    return new HarvesterDeployed__Params(this);
  }
}

export class HarvesterDeployed__Params {
  _event: HarvesterDeployed;

  constructor(event: HarvesterDeployed) {
    this._event = event;
  }

  get harvester(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nftHandler(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}
