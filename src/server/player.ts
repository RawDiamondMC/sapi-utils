import { Player } from "@minecraft/server";

/**
 * Get the required exp points by level.
 * @param level
 */
export function getExpCost(level: number): number {
  if (level >= 30) {
    return 62 + (level - 30) * 7;
  } else if (level >= 15) {
    return 17 + (level - 15) * 3;
  } else {
    return 17;
  }
}

/**
 * Get the exp in all.
 * @param player
 */
export function getAllExp(player: Player) {
  const level: number = player.level;
  let exp: number = 0;
  for (let i = 1; i <= level; i++) {
    exp += getExpCost(i);
  }
  return exp + player.xpEarnedAtCurrentLevel;
}
