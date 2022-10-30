import { Address, BigDecimal } from "@graphprotocol/graph-ts";

import { updateDaily, updateUserDaily } from "@shared/erc20";
import { Direction, handleApproval, handleTransfer } from "@shared/helpers";

import * as ERC20 from "../generated/ELM/ERC20";

const DIVIDER = BigDecimal.fromString(`${1e18}`);

export function onApproval(event: ERC20.Approval): void {
  const params = event.params;

  handleApproval(event, {
    operator: params.operator,
    owner: params.owner,
    value: params.value.divDecimal(DIVIDER),
  });
}

export function onTransfer(event: ERC20.Transfer): void {
  const params = event.params;
  const operator = event.transaction.to;

  const amount = params.amount.divDecimal(DIVIDER);
  const from = params.from;
  const to = params.to;

  handleTransfer(event, {
    amount,
    from,
    operator: operator ? operator : Address.zero(),
    to,
    tokenId: null,
  });

  updateDaily(event, { amount, from, to });
  updateUserDaily(event, { address: from, amount, direction: Direction.Out });
  updateUserDaily(event, { address: to, amount, direction: Direction.In });
}
