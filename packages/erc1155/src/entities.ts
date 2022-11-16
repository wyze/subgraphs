import {
  Bytes,
  Entity,
  Value,
  ValueKind,
  store,
} from "@graphprotocol/graph-ts";

export class Approval extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Approval entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Transfer must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Approval", id.toBytes().toHexString(), this);
    }
  }

  set blockNumber(value: i32) {
    this.set("blockNumber", Value.fromI32(value));
  }

  set blockTimestamp(value: i32) {
    this.set("blockTimestamp", Value.fromI32(value));
  }

  set operator(value: Bytes) {
    this.set("operator", Value.fromBytes(value));
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  set value(value: Value) {
    this.set("value", value);
  }
}

export class Daily extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Daily entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Daily must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Daily", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Daily | null {
    return changetype<Daily | null>(store.get("Daily", id.toHexString()));
  }

  set date(value: i32) {
    this.set("date", Value.fromI32(value));
  }

  get burns(): i32 {
    let value = this.get("burns");
    return value!.toI32();
  }

  set burns(value: i32) {
    this.set("burns", Value.fromI32(value));
  }

  get mints(): i32 {
    let value = this.get("mints");
    return value!.toI32();
  }

  set mints(value: i32) {
    this.set("mints", Value.fromI32(value));
  }

  get sinks(): i32 {
    let value = this.get("sinks");
    return value!.toI32();
  }

  set sinks(value: i32) {
    this.set("sinks", Value.fromI32(value));
  }

  get transfers(): i32 {
    let value = this.get("transfers");
    return value!.toI32();
  }

  set transfers(value: i32) {
    this.set("transfers", Value.fromI32(value));
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }
}

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

  get tokens(): string {
    let value = this.get("tokens");
    return value!.toString();
  }

  set tokens(value: string) {
    this.set("tokens", Value.fromString(value));
  }

  get daily(): Array<string> {
    let value = this.get("daily");
    return value!.toStringArray();
  }

  set daily(value: Array<string>) {
    this.set("daily", Value.fromStringArray(value));
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

  set date(value: i32) {
    this.set("date", Value.fromI32(value));
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }

  get amount(): i32 {
    let value = this.get("amount");
    return value!.toI32();
  }

  set amount(value: i32) {
    this.set("amount", Value.fromI32(value));
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }
}

export class Transfer extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Transfer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Transfer must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Transfer", id.toBytes().toHexString(), this);
    }
  }

  set amount(value: Value) {
    this.set("amount", value);
  }

  set blockNumber(value: i32) {
    this.set("blockNumber", Value.fromI32(value));
  }

  set blockTimestamp(value: i32) {
    this.set("blockTimestamp", Value.fromI32(value));
  }

  set operator(value: Bytes) {
    this.set("operator", Value.fromBytes(value));
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }
}
