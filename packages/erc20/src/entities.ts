import {
  BigDecimal,
  Bytes,
  Entity,
  Value,
  ValueKind,
  store,
} from "@graphprotocol/graph-ts";

export class User extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type User must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): User | null {
    return changetype<User | null>(store.get("User", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  get balance(): BigDecimal {
    let value = this.get("balance");
    return value!.toBigDecimal();
  }

  set balance(value: BigDecimal) {
    this.set("balance", Value.fromBigDecimal(value));
  }

  get received(): BigDecimal {
    let value = this.get("received");
    return value!.toBigDecimal();
  }

  set received(value: BigDecimal) {
    this.set("received", Value.fromBigDecimal(value));
  }

  get receivedCount(): i32 {
    let value = this.get("receivedCount");
    return value!.toI32();
  }

  set receivedCount(value: i32) {
    this.set("receivedCount", Value.fromI32(value));
  }

  get sent(): BigDecimal {
    let value = this.get("sent");
    return value!.toBigDecimal();
  }

  set sent(value: BigDecimal) {
    this.set("sent", Value.fromBigDecimal(value));
  }

  get sentCount(): i32 {
    let value = this.get("sentCount");
    return value!.toI32();
  }

  set sentCount(value: i32) {
    this.set("sentCount", Value.fromI32(value));
  }
}

export class UserDaily extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserDaily entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type UserDaily must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserDaily", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): UserDaily | null {
    return changetype<UserDaily | null>(
      store.get("UserDaily", id.toHexString())
    );
  }

  get date(): i32 {
    let value = this.get("date");
    return value!.toI32();
  }

  set date(value: i32) {
    this.set("date", Value.fromI32(value));
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }

  get balance(): BigDecimal {
    let value = this.get("balance");
    return value!.toBigDecimal();
  }

  set balance(value: BigDecimal) {
    this.set("balance", Value.fromBigDecimal(value));
  }

  get received(): BigDecimal {
    let value = this.get("received");
    return value!.toBigDecimal();
  }

  set received(value: BigDecimal) {
    this.set("received", Value.fromBigDecimal(value));
  }

  get receivedCount(): i32 {
    let value = this.get("receivedCount");
    return value!.toI32();
  }

  set receivedCount(value: i32) {
    this.set("receivedCount", Value.fromI32(value));
  }

  get sent(): BigDecimal {
    let value = this.get("sent");
    return value!.toBigDecimal();
  }

  set sent(value: BigDecimal) {
    this.set("sent", Value.fromBigDecimal(value));
  }

  get sentCount(): i32 {
    let value = this.get("sentCount");
    return value!.toI32();
  }

  set sentCount(value: i32) {
    this.set("sentCount", Value.fromI32(value));
  }
}
