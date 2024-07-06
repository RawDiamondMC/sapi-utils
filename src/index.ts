import { initWatchdogListener } from "./system";

export * as misc from "./misc.js";
export * as logger from "./logger.js";
export * as types from "./types.js";
export * as item from "./item.js";
export * as block from "./block.js";
export * as entity from "./entity.js";
export * as player from "./player.js";
export * as system from "./system.js";
export * from "./misc.js";
export * from "./types.js";
export * from "./item.js";
export * from "./block.js";
export * from "./entity.js";
export * from "./player.js";
export * from "./logger.js";
export * from "./system.js";

let initialized: boolean = false;

/**
 * The information for your addon.
 */
export interface ModInfo {
  /**
   * The name of your addon.
   * Default is `Minecraft`
   * i18n is not supported.
   */
  name: string;
  /**
   * The modid for your mod.
   * Default is `minecraft`
   */
  modid: string;
}

let info: ModInfo = { name: "Minecraft", modid: "minecraft" };

export function init(information: ModInfo) {
  if (initialized) throw new Error("ModInfo has already been initialized!");
  info = information;
  initWatchdogListener();
}

export function getModName() {
  return info.name;
}

export function getModId() {
  return info.modid;
}
