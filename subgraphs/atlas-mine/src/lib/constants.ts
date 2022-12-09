import { BigDecimal } from "@graphprotocol/graph-ts";

export const ONE = BigDecimal.fromString(`${1e18}`);

export const DAY = 86400;
export const ONE_WEEK = DAY * 7;
export const TWO_WEEKS = ONE_WEEK * 2;
export const ONE_MONTH = DAY * 30;
export const THREE_MONTHS = ONE_MONTH * 3;
export const SIX_MONTHS = ONE_MONTH * 6;
export const TWELVE_MONTHS = DAY * 365;
