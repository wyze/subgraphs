import {
  Bytes,
  Entity,
  Value,
  ValueKind,
  store,
} from "@graphprotocol/graph-ts";

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

  static load(id: i32): Token | null {
    return changetype<Token | null>(
      store.get("Token", Bytes.fromI32(id).toHexString())
    );
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set location(value: Bytes | null) {
    if (!value) {
      this.unset("location");
    } else {
      this.set("location", Value.fromBytes(changetype<Bytes>(value)));
    }
  }

  set owner(value: Bytes) {
    this.set("owner", Value.fromBytes(value));
  }

  set tokenId(value: i32) {
    this.set("tokenId", Value.fromI32(value));
  }
}
