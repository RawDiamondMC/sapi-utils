import { Block, BlockVolume, Dimension, Vector3 } from "@minecraft/server";
import { ensureNamespace } from "../misc";

/**
 * Find blocks around the given location with specific radius.
 * @param blockId The {@link Block.type.id} to be searched.
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
  blockId = ensureNamespace(blockId);
  let blocks: Block[] = [];
  for (let x = location.x - radius; x <= location.x + radius; x++) {
    for (let y = location.y - radius; y <= location.y + radius; y++) {
      for (let z = location.z - radius; z <= location.z + radius; z++) {
        const block: undefined | Block = dimension.getBlock({
          x: x,
          y: y,
          z: z,
        });
        if (block?.type.id === blockId) {
          blocks.push(block);
        }
      }
    }
  }
  return blocks;
}

/**
 * Find blocks around the given location with specific radius.
 * @param blockId The block to be searched for.
 * @param volume
 * @param dimension
 */
export function findBlocksByVolume(
  blockId: string,
  volume: BlockVolume,
  dimension: Dimension,
): Block[] {
  blockId = ensureNamespace(blockId);
  let blocks: Block[] = [];
  const min: Vector3 = volume.getMin();
  const max: Vector3 = volume.getMax();
  for (let x = min.x; x <= max.x; x++) {
    for (let y = min.y; y <= max.y; y++) {
      for (let z = min.z; z <= max.z; z++) {
        const block: Block | undefined = dimension.getBlock({
          x: x,
          y: y,
          z: z,
        });
        if (block?.type.id === blockId) {
          blocks.push(block);
        }
      }
    }
  }
  return blocks;
}
