import { system } from "@minecraft/server";
export * from "./stringify.js";

/**
 * Generate a random integer.
 * @return A random integer between min and max.
 * @param max Decimals will be parsed as Integers
 * @param min Decimals will be parsed as Integers. Default value is 0.
 * @throws RangeError if max<min
 */
export function randomInteger(max: number, min?: number) {
  if (min == undefined) {
    min = 0;
  }
  max = Math.ceil(max);
  min = Math.ceil(min);
  if (max < min) {
    throw new RangeError(
      `randomInteger() is used incorrectly ! Expect: any number higher than ${min}. Current: ${max}`,
    );
  }
  if (max == min) {
    return max;
  }
  const random: number = system.currentTick + Math.random() * max;
  return Math.ceil(random / max) + min;
}

/**
 * Generate a UUID.
 * @return a UUID
 */
export function generateUUID(): string {
  const currentTimestamp: number = system.currentTick;
  return "xxxxxxxx-xxxx-4xxx-yxxx-zxxxxxxx".replace(
    /[xyz]/g,
    (args: string) => {
      const random: number = (Math.random() * 16) | 0;
      const value: number = args == "x" ? random : (random & 0x3) | 0x8;
      if (args === "z")
        return value.toString(16) + currentTimestamp.toString(16).slice(-4);
      else return value.toString(16);
    },
  );
}

/**
 * A simple function that checks if a variable is undefined or null;
 * Like Objects.requireNonNull in java.
 * @param object the object or variable to check;
 * @param message the Error message (if thrown).
 */
export function requireNonNull(object: any, message?: string) {
  if (object === undefined || object === null) {
    throw new Error(message);
  }
  return object;
}
