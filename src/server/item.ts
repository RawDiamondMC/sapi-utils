import {
  Container,
  Entity,
  ItemComponent,
  ItemComponentTypes,
  ItemDurabilityComponent,
  ItemStack,
  Player,
} from "@minecraft/server";

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
): number {
  let amount: number = 0;
  if (typeof newItem === "string") {
    newItem = new ItemStack(newItem);
  }
  for (let slot = 0; slot < container.size; slot++) {
    const itemStack: undefined | ItemStack = container.getItem(slot);
    if (itemStack === item) {
      container.setItem(slot, newItem);
      amount++;
      continue;
    }
    if (itemStack?.typeId === item) {
      container.setItem(slot, newItem);
      amount++;
    }
  }
  return amount;
}

/**
 * Damage an {@link ItemStack}.
 * @param item The {@link ItemStack} to be damaged.
 * @param value The durability to be removed.
 * @param entity The optional {@link Entity} which breaks this tool.
 * @returns the damaged {@link ItemStack}.
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
 * Edit the amount of an {@link ItemStack}.
 * @param item The {@link ItemStack}.
 * @param value The amount to be removed.
 * @returns the new {@link ItemStack}.
 * @throws SapiError if amount is not enough to be removed.
 * @throws SapiError if max amount is not high enough.
 */
export function consumeAmount(
  item: ItemStack,
  value: number,
): ItemStack | undefined {
  const amount: number = item.amount;
  if (amount === value) return undefined;
  if (amount - value < 0)
    throw new Error(
      `ItemStack ${item.typeId} doesn't have enough amount to be removed! Current: ${amount}.`,
    );
  if (amount - value > item.maxAmount)
    throw new Error(
      `ItemStack ${item.typeId}'s max amount is not high enough!`,
    );
  const newItem: ItemStack = item.clone();
  newItem.amount = amount - value;
  return newItem;
}

/**
 * Get the item amount in a container
 * @param container
 * @param item the item's id
 */
export function getItemAmountInContainer(container: Container, item: string) {
  let amount: number = 0;
  for (let slot = 0; slot < container.size; slot++) {
    const itemStack: undefined | ItemStack = container.getItem(slot);
    if (itemStack?.typeId === item) {
      amount++;
    }
  }
  return amount;
}

/**
 * Remove the item by amount in a container
 * @param container
 * @param itemId
 * @param amount
 */
export function removeItemInContainer(
  container: Container,
  itemId: string,
  amount: number,
) {
  for (let slot = 0; slot < container.size; slot++) {
    const itemStack: undefined | ItemStack = container.getItem(slot);
    if (itemStack?.typeId === itemId) {
      if (itemStack.amount > amount) {
        itemStack.amount -= amount;
        container.setItem(slot, itemStack);
        return;
      }
      container.setItem(slot, undefined);
      amount -= itemStack.amount;
    }
  }
}
