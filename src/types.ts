import { Dimension, world } from "@minecraft/server";

export const Overworld: Dimension = world.getDimension("minecraft:overworld");
export const Nether: Dimension = world.getDimension("minecraft:nether");
export const TheEnd: Dimension = world.getDimension("minecraft:the_end");

export const GoodEffects: string[] = [
  "speed",
  "haste",
  " strength",
  "instant_health",
  "jump_boost",
  "regeneration",
  "resistance",
  "fire_resistance",
  "water_breathing",
  "invisibility",
  "night_vision",
  "health_boost",
  "absorption",
  "saturation",
  "slow_falling",
  "conduit_power",
  "village_hero",
];

export const BadEffects: string[] = [
  "slowness",
  "mining_fatigue",
  "instant_damage",
  "nausea",
  "blindness",
  "hunger",
  "weakness",
  "poison",
  "wither",
  "levitation",
  "fatal_poison",
  "darkness",
  "wind_charged",
  "weaving",
  "oozing",
  "infested",
];
