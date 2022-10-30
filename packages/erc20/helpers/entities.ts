import { BigDecimal, Entity, store, Value, ValueKind } from "@graphprotocol/graph-ts";

export class Daily extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Daily entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Daily must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Daily", id.toString(), this);
    }
  }

  static load(id: string): Daily | null {
    return changetype<Daily | null>(store.get("Daily", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get date(): i32 {
    let value = this.get("date");
    return value!.toI32();
  }

  set date(value: i32) {
    this.set("date", Value.fromI32(value));
  }

  get burned(): BigDecimal {
    let value = this.get("burned");
    return value!.toBigDecimal();
  }

  set burned(value: BigDecimal) {
    this.set("burned", Value.fromBigDecimal(value));
  }

  get burns(): i32 {
    let value = this.get("burns");
    return value!.toI32();
  }

  set burns(value: i32) {
    this.set("burns", Value.fromI32(value));
  }

  get minted(): BigDecimal {
    let value = this.get("minted");
    return value!.toBigDecimal();
  }

  set minted(value: BigDecimal) {
    this.set("minted", Value.fromBigDecimal(value));
  }

  get mints(): i32 {
    let value = this.get("mints");
    return value!.toI32();
  }

  set mints(value: i32) {
    this.set("mints", Value.fromI32(value));
  }

  get transferred(): BigDecimal {
    let value = this.get("transferred");
    return value!.toBigDecimal();
  }

  set transferred(value: BigDecimal) {
    this.set("transferred", Value.fromBigDecimal(value));
  }

  get transfers(): i32 {
    let value = this.get("transfers");
    return value!.toI32();
  }

  set transfers(value: i32) {
    this.set("transfers", Value.fromI32(value));
  }
}


export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get balance(): BigDecimal {
    let value = this.get("balance");
    return value!.toBigDecimal();
  }

  set balance(value: BigDecimal) {
    this.set("balance", Value.fromBigDecimal(value));
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
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UserDaily entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type UserDaily must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("UserDaily", id.toString(), this);
    }
  }

  static load(id: string): UserDaily | null {
    return changetype<UserDaily | null>(store.get("UserDaily", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get date(): i32 {
    let value = this.get("date");
    return value!.toI32();
  }

  set date(value: i32) {
    this.set("date", Value.fromI32(value));
  }

  get user(): string {
    let value = this.get("user");
    return value!.toString();
  }

  set user(value: string) {
    this.set("user", Value.fromString(value));
  }

  get balance(): BigDecimal {
    let value = this.get("balance");
    return value!.toBigDecimal();
  }

  set balance(value: BigDecimal) {
    this.set("balance", Value.fromBigDecimal(value));
  }
}
