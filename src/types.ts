import { Dimension, world } from "@minecraft/server";

export const Overworld: Dimension = world.getDimension("minecraft:overworld");
export const Nether: Dimension = world.getDimension("minecraft:nether");
export const TheEnd: Dimension = world.getDimension("minecraft:the_end");

export const GoodEffects: string[] = [
  "minecraft:speed",
  "minecraft:haste",
  "minecraft:strength",
  "minecraft:instant_health",
  "minecraft:jump_boost",
  "minecraft:regeneration",
  "minecraft:resistance",
  "minecraft:fire_resistance",
  "minecraft:water_breathing",
  "minecraft:invisibility",
  "minecraft:night_vision",
  "minecraft:health_boost",
  "minecraft:absorption",
  "minecraft:saturation",
  "minecraft:slow_falling",
  "minecraft:conduit_power",
  "minecraft:village_hero",
];

export const BadEffects: string[] = [
  "minecraft:slowness",
  "minecraft:mining_fatigue",
  "minecraft:instant_damage",
  "minecraft:nausea",
  "minecraft:blindness",
  "minecraft:hunger",
  "minecraft:weakness",
  "minecraft:poison",
  "minecraft:wither",
  "minecraft:levitation",
  "minecraft:fatal_poison",
  "minecraft:darkness",
  "minecraft:wind_charged",
  "minecraft:weaving",
  "minecraft:oozing",
  "minecraft:infested",
];
