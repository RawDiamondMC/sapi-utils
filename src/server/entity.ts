import { Effect, EffectType, Entity } from "@minecraft/server";
import { BadEffects, GoodEffects } from "../types";

/**
 * Wrapper function for removing effect(s) or effect group.
 * @param entity The entity to be removed effect.
 * @param effectType The effect(s) to remove. Available groups: "all", "bad", "good".
 */
export function clearEffect(
  entity: Entity,
  effectType: EffectType | EffectType[] | string | string[],
): void {
  switch (effectType) {
    case "all":
      entity.getEffects().forEach((effect: Effect) => {
        entity.removeEffect(effect.typeId);
      });
      break;
    case "bad":
      BadEffects.forEach((effect: string) => {
        entity.removeEffect(effect);
      });
      break;
    case "good":
      GoodEffects.forEach((effect: string) => {
        entity.removeEffect(effect);
      });
      break;
    default:
      if (Array.isArray(effectType)) {
        effectType.forEach((effect: string | EffectType) => {
          entity.removeEffect(effect);
        });
        return;
      }
      entity.removeEffect(effectType);
      break;
  }
}
