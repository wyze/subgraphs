import {
  Address,
  Entity,
  Value,
  ValueKind,
  store,
} from "@graphprotocol/graph-ts";

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
