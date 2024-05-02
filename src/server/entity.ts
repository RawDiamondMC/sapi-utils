import { Effect, EffectType, Entity } from "@minecraft/server";

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
      entity.removeEffect("slowness");
      entity.removeEffect("mining_fatigue");
      entity.removeEffect("instant_damage");
      entity.removeEffect("nausea");
      entity.removeEffect("blindness");
      entity.removeEffect("hunger");
      entity.removeEffect("weakness");
      entity.removeEffect("poison");
      entity.removeEffect("wither");
      entity.removeEffect("fatal_poison");
      entity.removeEffect("bad_omen");
      entity.removeEffect("levitation");
      entity.removeEffect("darkness");
      break;
    case "good":
      entity.removeEffect("speed");
      entity.removeEffect("haste");
      entity.removeEffect("strength");
      entity.removeEffect("instant_health");
      entity.removeEffect("regeneration");
      entity.removeEffect("jump_boost");
      entity.removeEffect("invisibility");
      entity.removeEffect("water_breathing");
      entity.removeEffect("health_boost");
      entity.removeEffect("night_vision");
      entity.removeEffect("saturation");
      entity.removeEffect("absorption");
      entity.removeEffect("village_hero");
      entity.removeEffect("conduit_power");
      entity.removeEffect("slow_falling");
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
