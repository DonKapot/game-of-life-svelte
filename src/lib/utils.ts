import type { twoDimensionalWorld, Entity, EntityConfig } from "./types";
export const getEntitySiblings = (
  world: twoDimensionalWorld,
  entity: Entity
) => {
  // items[x][y]
  const top = world?.[entity.x]?.[entity.y + 1];
  const topRight = world?.[entity.x + 1]?.[entity.y + 1];
  const right = world?.[entity.x + 1]?.[entity.y];
  const rightBottom = world?.[entity.x + 1]?.[entity.y - 1];
  const bottom = world?.[entity.x]?.[entity.y - 1];
  const leftBottom = world?.[entity.x - 1]?.[entity.y - 1];
  const left = world?.[entity.x - 1]?.[entity.y];
  const leftTop = world?.[entity.x - 1]?.[entity.y + 1];
  const siblings = [
    top,
    topRight,
    right,
    rightBottom,
    bottom,
    leftBottom,
    left,
    leftTop,
  ];
  return siblings.filter((i) => !!i);
};

export const getTwoDimensionalWorld = (
  size = 50,
  config = { life: false } as EntityConfig
): twoDimensionalWorld =>
  Array(size)
    .fill(0)
    .map((c, x) =>
      Array(size)
        .fill(0)
        .map((r, y) => ({
          x,
          y,
          ...config,
        }))
    );

export const isSameItem = (item1: Entity, item2: Entity) =>
  item1.x === item2.x && item1.y === item2.y;

export const generateEntity = (
  { x, y }: Entity,
  config = {} as EntityConfig
) => ({
  x,
  y,
  ...config,
});
