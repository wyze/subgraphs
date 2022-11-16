import {
  BigDecimal,
  Bytes,
  Entity,
  Value,
  ValueKind,
  store,
} from "@graphprotocol/graph-ts";

export class Listing extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Listing entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Listing must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Listing", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Listing | null {
    return changetype<Listing | null>(store.get("Listing", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get amount(): i32 {
    let value = this.get("amount");
    return value!.toI32();
  }

  set amount(value: i32) {
    this.set("amount", Value.fromI32(value));
  }

  get available(): Bytes {
    let value = this.get("available");
    return value!.toBytes();
  }

  set available(value: Bytes) {
    this.set("available", Value.fromBytes(value));
  }

  get expires(): i32 {
    let value = this.get("expires");
    return value!.toI32();
  }

  set expires(value: i32) {
    this.set("expires", Value.fromI32(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value!.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }

  get token(): Bytes {
    let value = this.get("token");
    return value!.toBytes();
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }

  get status(): string {
    let value = this.get("status");
    return value!.toString();
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    return value!.toBytes();
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }
}

export class Token extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Token must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Token", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Token | null {
    return changetype<Token | null>(store.get("Token", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get listings(): Array<Bytes> {
    let value = this.get("listings");
    return value!.toBytesArray();
  }

  set listings(value: Array<Bytes>) {
    this.set("listings", Value.fromBytesArray(value));
  }

  get owners(): Array<Bytes> {
    let value = this.get("owners");
    return value!.toBytesArray();
  }

  set owners(value: Array<Bytes>) {
    this.set("owners", Value.fromBytesArray(value));
  }
}
