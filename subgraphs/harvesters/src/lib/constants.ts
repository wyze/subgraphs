import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ONE = BigDecimal.fromString(`${1e18}`);

export const ONE_HOUR = 3600;
export const THREE_HOURS = ONE_HOUR * 3;

export const DAY = 86400;
export const ONE_WEEK = DAY * 7;
export const TWO_WEEKS = ONE_WEEK * 2;
export const ONE_MONTH = DAY * 30;
export const THREE_MONTHS = ONE_MONTH * 3;
export const SIX_MONTHS = ONE_MONTH * 6;
export const TWELVE_MONTHS = DAY * 365;

export const EXTRACTOR_BOOSTS = [20, 25, 30];
export const EXTRACTOR_LIFETIME = BigInt.fromI32(10800);
export const EXTRACTOR_SIZE = ["small", "medium", "large"];
export const EXTRACTOR_TOKEN_IDS = [
  BigInt.fromI32(4),
  BigInt.fromI32(5),
  BigInt.fromI32(6),
];

export const NAMES = new TypedMap<string, string>();

NAMES.set("0x88bf661446c8f5a7072c0f75193dae0e18ae40bc", "Asiterra");
NAMES.set("0xdf9f9ca6ee5c3024b64dcecbadc462c0b896147a", "Kameji");
NAMES.set("0x2b1de6d22e6cb9178b3ecbcb7f20b62fcce925d4", "Shinoba");
NAMES.set("0x70a75ac9537f6cdac553f82b6e39484acc521067", "Afarit");
NAMES.set("0x3fbfcdc02f649d5875bc9f97281b7ef5a7a9c491", "Lupus Magus");
NAMES.set("0xa0a89db1c899c49f98e6326b764bafcf167fc2ce", "Atlas Mine");
