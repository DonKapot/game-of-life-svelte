import { derived, get, writable } from "svelte/store";
import type { Entity, EntityConfig, twoDimensionalWorld } from "../types";
import {
  getEntitySiblings,
  getTwoDimensionalWorld,
  isSameItem,
} from "../utils";

export const worldSize = writable(50);

export const getWorldStore = (size = get(worldSize)) => {
  const store = writable<twoDimensionalWorld>(getTwoDimensionalWorld(size));
  const { subscribe, set, update } = store;

  return {
    subscribe,
    set,
    updateEntity: (entity: Entity, config = { life: true } as EntityConfig) =>
      update((items: twoDimensionalWorld) =>
        items.map((c) =>
          c.map((item) => ({
            ...item,
            ...(isSameItem(entity, item) && config),
          }))
        )
      ),
    updateWorldSize: (size: number) => {
      update((items: twoDimensionalWorld) => {
        const newWorld = getTwoDimensionalWorld(size);
        return newWorld.map((c, x) =>
          c.map((newItem, y) => {
            const existedItem = items?.[x]?.[y];
            return existedItem ? { ...existedItem } : newItem;
          })
        );
      });
    },
    getEntity: (x: string | number, y: string | number) =>
      (get(store)?.[x]?.[y] || {}) as Entity,
    getEntitySiblings: (entity: Entity) =>
      getEntitySiblings(get(store), entity),
    toggleEntities: () =>
      set(
        get(store).map((c) =>
          c.map((item) => {
            const siblings = worldState.getEntitySiblings(item);
            const aliveCount = siblings.reduce(
              (p, c) => (c.life ? p + 1 : p),
              0
            );
            return {
              ...item,
              life:
                (item.life && (aliveCount === 2 || aliveCount === 3)) ||
                (!item.life && aliveCount === 3),
            };
          })
        )
      ),
    reset: () =>
      set(
        get(store).map((c) =>
          c.map((item) => ({
            ...item,
            life: false,
          }))
        )
      ),
  };
};

export let worldState = getWorldStore(get(worldSize));

export const aliveCells = derived(worldState, ($items) =>
  $items.flat(1).filter((e) => e.life)
);

export const isAliveCells = derived(
  aliveCells,
  ($aliveCells) => $aliveCells.length > 0
);

export const isRun = writable(false);

export const itemSize = writable(1);
