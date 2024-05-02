import { Block, Dimension, Vector3 } from "@minecraft/server";

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
