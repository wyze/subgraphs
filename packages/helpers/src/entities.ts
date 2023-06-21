import {
  Bytes,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
} from "@graphprotocol/graph-ts";

const CONFIG_ID = Bytes.fromUTF8("global");

export class Config extends Entity {
  constructor() {
    super();
    this.set("id", Value.fromBytes(CONFIG_ID));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Config entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Config must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Config", id.toBytes().toHexString(), this);
    }
  }

  static load(): Config | null {
    return changetype<Config | null>(
      store.get("Config", CONFIG_ID.toHexString())
    );
  }

  get address(): Bytes {
    let value = this.get("address");
    return value!.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get ignoredTokens(): Array<i32> {
    let value = this.get("ignoredTokens");
    return value!.toI32Array();
  }

  set ignoredTokens(value: Array<i32>) {
    this.set("ignoredTokens", Value.fromI32Array(value));
  }

  get nextExpiresTimestamp(): i32 {
    let value = this.get("nextExpiresTimestamp");
    return value!.toI32();
  }

  set nextExpiresTimestamp(value: i32) {
    this.set("nextExpiresTimestamp", Value.fromI32(value));
  }

  get listings(): Array<Bytes> {
    let value = this.get("listings");
    return value!.toBytesArray();
  }

  set listings(value: Array<Bytes>) {
    this.set("listings", Value.fromBytesArray(value));
  }
}

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
        `Entities of type Approval must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
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

export class Stake extends Entity {
  constructor(id: Address) {
    super();
    this.set("id", Value.fromAddress(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Stake entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Stake must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Stake", id.toBytes().toHexString(), this);
    }
  }
}

export class StakedToken extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save StakedToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type StakedToken must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("StakedToken", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): StakedToken | null {
    return changetype<StakedToken | null>(
      store.get("StakedToken", id.toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  get amount(): i32 {
    let value = this.get("amount");
    return value!.toI32();
  }

  set amount(value: i32) {
    this.set("amount", Value.fromI32(value));
  }

  set sink(value: Bytes) {
    this.set("sink", Value.fromBytes(value));
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }
}

export class Token extends Entity {
  constructor(id: i32) {
    super();
    this.set("id", Value.fromBytes(Bytes.fromI32(id)));
    this.set("tokenId", Value.fromI32(id));
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

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
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

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
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

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  set operator(value: Bytes) {
    this.set("operator", Value.fromBytes(value));
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
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

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get tokens(): Array<Bytes> {
    let value = this.get("tokens");
    return value!.toBytesArray();
  }

  set tokens(value: Array<Bytes>) {
    this.set("tokens", Value.fromBytesArray(value));
  }

  get listings(): Array<Bytes> {
    let value = this.get("listings");
    return value!.toBytesArray();
  }

  set listings(value: Array<Bytes>) {
    this.set("listings", Value.fromBytesArray(value));
  }
}

export class UserToken extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserToken entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type UserToken must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserToken", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): UserToken | null {
    return changetype<UserToken | null>(
      store.get("UserToken", id.toHexString())
    );
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

  get token(): Bytes {
    let value = this.get("token");
    return value!.toBytes();
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }

  get user(): Bytes {
    let value = this.get("user");
    return value!.toBytes();
  }

  set user(value: Bytes) {
    this.set("user", Value.fromBytes(value));
  }
}
