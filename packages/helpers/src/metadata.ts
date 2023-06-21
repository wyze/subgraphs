export function getBalancerCrystalName(tokenId: i32): string {
  switch (tokenId) {
    case 1:
      return "Balancer Crystal";
    default:
      return "";
  }
}

export function getConsumableName(tokenId: i32): string {
  switch (tokenId) {
    case 1:
      return "Small Prism";
    case 2:
      return "Medium Prism";
    case 3:
      return "Large Prism";
    case 4:
      return "Small Extractor";
    case 5:
      return "Medium Extractor";
    case 6:
      return "Large Extractor";
    case 7:
      return "Harvester Part";
    case 8:
      return "Essence of Starlight";
    case 9:
      return "Prism Shards";
    case 10:
      return "Universal Lock";
    case 11:
      return "Azurite Dust";
    case 12:
      return "Essence of Honeycomb";
    case 13:
      return "Essence of Grin";
    case 14:
      return "Shrouded Tesseract";
    default:
      return "";
  }
}

export function getConsumableSize(tokenId: i32): string {
  switch (tokenId) {
    case 1:
    case 4:
      return "Small";
    case 2:
    case 5:
      return "Medium";
    case 3:
    case 6:
      return "Large";
    default:
      return "";
  }
}

export function getConsumableType(tokenId: i32): string {
  switch (tokenId) {
    case 1:
    case 2:
    case 3:
      return "Prism";
    case 4:
    case 5:
    case 6:
      return "Extractor";
    case 7:
      return "HarvesterPart";
    case 8:
    case 12:
    case 13:
      return "Essence";
    case 9:
      return "Shards";
    case 10:
      return "Lock";
    case 11:
      return "Dust";
    case 14:
      return "Tesseract";
    default:
      return "Unknown";
  }
}

export function getFragmentCategories(tokenId: i32): string[] {
  switch (true) {
    case [1, 2, 3, 4, 5].includes(tokenId):
      return ["Alchemy", "Arcana"];
    case [6, 7, 8, 9, 10].includes(tokenId):
      return ["Brewing", "Enchanting"];
    case [11, 12, 13, 14, 15].includes(tokenId):
      return ["Leatherworking", "Smithing"];
    default:
      return [];
  }
}

export function getFragmentName(tokenId: i32): string {
  const categories = getFragmentCategories(tokenId).join(" & ");
  const numeral = getFragmentRomanNumeral(getFragmentTier(tokenId));

  return `${categories} ${numeral}`;
}

function getFragmentRomanNumeral(tier: i32): string {
  switch (tier) {
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    case 5:
      return "V";
    default:
      return "";
  }
}

export function getFragmentTier(tokenId: i32): i32 {
  switch (true) {
    case [1, 6, 11].includes(tokenId):
      return 1;
    case [2, 7, 12].includes(tokenId):
      return 2;
    case [3, 8, 13].includes(tokenId):
      return 3;
    case [4, 9, 14].includes(tokenId):
      return 4;
    case [5, 10, 15].includes(tokenId):
      return 5;
    default:
      return 0;
  }
}

export function getTreasureBoost(tokenId: i32): string {
  switch (tokenId) {
    case 39: // Ancient Relic x%
      return "7.5";
    case 46: // Bag of Rare Mushrooms 6.2%
    case 104: // Military Stipend 6.2%
      return "6.2";
    case 47: // Bait for Monsters 7.3%
    case 161: // Thread of Divine Silk 7.3%
    case 54: // Castle 7.3%
      return "7.3";
    case 48: // Beetle-wing 0.8%
    case 73: // Diamond 0.8%
    case 77: // Dragon Tail 0.8%
    case 79: // Emerald 0.8%
    case 92: // Gold Coin 0.8%
    case 96: // Half-Penny 0.8%
    case 115: // Pearl 0.8%
    case 117: // Quarter-Penny 0.8%
    case 133: // Red Rupee 0.8%
    case 151: // Silver Coin 0.8%
      return "0.8";
    case 49: // Blue Rupee 1.5%
      return "1.5";
    case 51: // Bottomless Elixir 7.6%
    case 52: // Cap of Invisibility 7.6%
      return "7.6";
    case 53: // Carriage 6.1%
      return "6.1";
    case 68: // Common Bead 5.6%
    case 82: // Favor from the Gods 5.6%
      return "5.6";
    case 69: // Common Feather 3.4%
      return "3.4";
    case 71: // Common Relic 2.2%
      return "2.2";
    case 72: // Cow 5.8%
    case 91: // Framed Butterfly 5.8%
    case 116: // Pot of Gold 5.8%
      return "5.8";
    case 74: // Divine Hourglass 6.3%
      return "6.3";
    case 75: // Divine Mask 5.7%
      return "5.7";
    case 76: // Donkey 1.2%
      return "1.2";
    case 93: // Grain 3.2%
    case 94: // Green Rupee 3.3%
      return "3.3";
    case 95: // Grin 15.7%
      return "15.7";
    case 97: // Honeycomb 15.8%
      return "15.8";
    case 98: // Immovable Stone 7.2%
      return "7.2";
    case 99: // Ivory Breastpin 6.4%
    case 132: // Red Feather 6.4%
    case 153: // Snow White Feather 6.4%
      return "6.4";
    case 100: // Jar of Fairies 5.3%
      return "5.3";
    case 103: // Lumber 3%
      return "3";
    case 105: // Mollusk Shell 6.7%
      return "6.7";
    case 114: // Ox 1.6%
      return "1.6";
    case 141: // Score of Ivory 6%
    case 152: // Small Bird 6%
      return "6";
    case 162: // Unbreakable Pocketwatch 5.9%
      return "5.9";
    case 164: // Witches Broom 5.1%
      return "5.1";
    default:
      return "0";
  }
}

export function getTreasureCategory(tokenId: i32): string {
  switch (true) {
    case [54, 99, 141, 68, 94, 73, 79].includes(tokenId):
      return "Alchemy";
    case [95, 161, 74, 162, 75, 71, 115].includes(tokenId):
      return "Arcana";
    case [39, 47, 132, 82, 164, 93, 77, 48].includes(tokenId):
      return "Brewing";
    case [51, 98, 153, 91, 100, 69, 49, 151].includes(tokenId):
      return "Enchanting";
    case [97, 105, 46, 152, 72, 76, 96, 117].includes(tokenId):
      return "Leatherworking";
    case [52, 104, 53, 116, 103, 114, 133, 92].includes(tokenId):
      return "Smithing";
    default:
      return "";
  }
}

export function getTreasureName(tokenId: i32): string {
  switch (tokenId) {
    case 39:
      return "Ancient Relic";
    case 46:
      return "Bag of Rare Mushrooms";
    case 47:
      return "Bait for Monsters";
    case 48:
      return "Beetle Wings";
    case 49:
      return "Blue Rupee";
    case 51:
      return "Bottomless Elixir";
    case 52:
      return "Cap of Invisibility";
    case 53:
      return "Carriage";
    case 54:
      return "Castle";
    case 68:
      return "Common Bead";
    case 69:
      return "Common Feather";
    case 70:
      return "Common Legion";
    case 71:
      return "Common Relic";
    case 72:
      return "Cow";
    case 73:
      return "Diamond";
    case 74:
      return "Divine Hourglass";
    case 75:
      return "Divine Mask";
    case 76:
      return "Donkey";
    case 77:
      return "Dragon Tail";
    case 79:
      return "Emerald";
    case 82:
      return "Favor from the Gods";
    case 91:
      return "Framed Butterfly";
    case 92:
      return "Gold Coin";
    case 93:
      return "Grain";
    case 94:
      return "Green Rupee";
    case 95:
      return "Grin";
    case 96:
      return "Half-Penny";
    case 97:
      return "Honeycomb";
    case 98:
      return "Immovable Stone";
    case 99:
      return "Ivory Breastpin";
    case 100:
      return "Jar of Fairies";
    case 103:
      return "Lumber";
    case 104:
      return "Military Stipend";
    case 105:
      return "Mollusk Shell";
    case 114:
      return "Ox";
    case 115:
      return "Pearl";
    case 116:
      return "Pot of Gold";
    case 117:
      return "Quarter-Penny";
    case 132:
      return "Red Feather";
    case 133:
      return "Red Rupee";
    case 141:
      return "Score of Ivory";
    case 151:
      return "Silver Coin";
    case 152:
      return "Small Bird";
    case 153:
      return "Snow White Feather";
    case 161:
      return "Thread of Divine Silk";
    case 162:
      return "Unbreakable Pocketwatch";
    case 164:
      return "Witches Broom";
    default:
      return "";
  }
}

export function getTreasureTier(tokenId: i32): i32 {
  switch (true) {
    case [54, 95, 39, 51, 97, 52].includes(tokenId):
      return 1;
    case [99, 161, 74, 47, 132, 98, 153, 105, 46, 104, 53].includes(tokenId):
      return 2;
    case [141, 68, 162, 75, 82, 91, 100, 152, 72, 116].includes(tokenId):
      return 3;
    case [94, 71, 164, 93, 69, 49, 76, 103, 114].includes(tokenId):
      return 4;
    case [73, 79, 115, 77, 48, 151, 96, 117, 133, 92].includes(tokenId):
      return 5;
    default:
      return 0;
  }
}
