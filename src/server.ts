import {
  Block,
  Container,
  Dimension,
  Effect,
  EffectType,
  Entity,
  ItemComponent,
  ItemComponentTypes,
  ItemDurabilityComponent,
  ItemStack,
  Player,
  Vector3,
} from "@minecraft/server";

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

/**
 * Damage an item.
 * @param item The item stack to be damaged.
 * @param value The durability to be removed.
 * @param entity The optional entity which breaks this tool.
 * @returns the damaged item stack.
 */
export function consumeDurability(
  item: ItemStack,
  value: number,
  entity?: Entity,
): ItemStack | undefined {
  const durability: undefined | ItemComponent = item.getComponent(
    ItemComponentTypes.Durability,
  );
  if (
    durability === undefined ||
    !(durability instanceof ItemDurabilityComponent)
  )
    return item;
  if (durability.damage + value >= durability.maxDurability) {
    if (entity instanceof Player) {
      entity.playSound("random.break");
    }
    return undefined;
  } else {
    durability.damage += value;
    return item;
  }
}

/**
 * Replace {@link ItemStack} in a {@link Container}
 * @param item The {@link ItemStack} or {@link ItemStack.typeId} to be replaced.
 * if it's undefined, every empty slot will be filled.
 * @param newItem the new {@link ItemStack}.
 * if it's undefined, the matched slot will be cleared.
 * @param container the {@link Container} which will be searched.
 */
export function replaceItemStack(
  item: ItemStack | string | undefined,
  newItem: ItemStack | string | undefined,
  container: Container,
): void {
  if (typeof newItem === "string") {
    newItem = new ItemStack(newItem);
  }
  for (let slot = 0; slot < container.size; slot++) {
    const itemStack: undefined | ItemStack = container.getItem(slot);
    if (itemStack === item) {
      container.setItem(slot, newItem);
      continue;
    }
    if (itemStack?.typeId === item) {
      container.setItem(slot, newItem);
    }
  }
}

/**
 * Find blocks around the given location with specific radius.
 * @param blockId The {@link Block.typeId} to be searched.
 * @param location
 * @param dimension
 * @param radius
 */
export function findBlocks(
  blockId: string,
  location: Vector3,
  dimension: Dimension,
  radius: number,
): Block[] {
  let blocks: Block[] = [];
  for (let x = location.x - radius; x <= location.x + radius; x++) {
    for (let y = location.y - radius; y <= location.y + radius; y++) {
      for (let z = location.z - radius; z <= location.z + radius; z++) {
        const block: undefined | Block = dimension.getBlock({
          x: x,
          y: y,
          z: z,
        });
        if (block?.typeId === blockId) {
          blocks.push(block);
        }
      }
    }
  }
  return blocks;
}
