<script lang="ts">
  import { itemSize, worldState } from "$lib/store/world";
  import { getEntitySiblings } from "$lib/utils";

  export let x: number | string;
  export let y: number | string;

  function toggleItem() {
    const entity = worldState.getEntity(x, y);
    const life = !entity.life;
    worldState.updateEntity(entity, { life });
  }

  function toggleItems() {
    const entity = worldState.getEntity(x, y);
    const life = !entity.life;
    const siblings = getEntitySiblings($worldState, entity);
    siblings.forEach((e) => {
      worldState.updateEntity(e, { life });
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="item x-{x} y-{y}"
  class:life={$worldState?.[x]?.[y]?.life}
  style="height: {`${$itemSize}vh`}; width: {`${$itemSize}vh`};"
  on:click={toggleItem}
  on:dblclick={toggleItems}
/>

<style>
  .item {
    border: 1px solid gray;
    margin: 2px;
    background-color: white;
    border-radius: 4px;
  }
  .life {
    background-color: rgb(150, 236, 150);
  }
</style>
