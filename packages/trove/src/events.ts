import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";

export class ItemCanceled extends ethereum.Event {
  get params(): ItemCanceled__Params {
    return new ItemCanceled__Params(this);
  }
}

export class ItemCanceled__Params {
  _event: ItemCanceled;

  constructor(event: ItemCanceled) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ItemListed extends ethereum.Event {
  get params(): ItemListed__Params {
    return new ItemListed__Params(this);
  }
}

export class ItemListed__Params {
  _event: ItemListed;

  constructor(event: ItemListed) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get expirationTime(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get paymentToken(): Address {
    return this._event.parameters[6].value.toAddress();
  }
}

export class ItemSold extends ethereum.Event {
  get params(): ItemSold__Params {
    return new ItemSold__Params(this);
  }
}

export class ItemSold__Params {
  _event: ItemSold;

  constructor(event: ItemSold) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get buyer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get paymentToken(): Address {
    return this._event.parameters[6].value.toAddress();
  }
}

export class ItemUpdated extends ethereum.Event {
  get params(): ItemUpdated__Params {
    return new ItemUpdated__Params(this);
  }
}

export class ItemUpdated__Params {
  _event: ItemUpdated;

  constructor(event: ItemUpdated) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get expirationTime(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get paymentToken(): Address {
    return this._event.parameters[6].value.toAddress();
  }
}

export class BidAccepted extends ethereum.Event {
  get params(): BidAccepted__Params {
    return new BidAccepted__Params(this);
  }
}

export class BidAccepted__Params {
  _event: BidAccepted;

  constructor(event: BidAccepted) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get buyer(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nft(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get quantity(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get pricePerItem(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get paymentToken(): Address {
    return this._event.parameters[6].value.toAddress();
  }

  get bidType(): i32 {
    return this._event.parameters[7].value.toI32();
  }
}

export class Trove extends ethereum.SmartContract {
  static bind(address: Address): Trove {
    return new Trove("Trove", address);
  }
}
