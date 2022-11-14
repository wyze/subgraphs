import {
  BigDecimal,
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

export class Token extends Entity {
  constructor(id: i32) {
    super();
    this.set("id", Value.fromBytes(Bytes.fromI32(id)));
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
