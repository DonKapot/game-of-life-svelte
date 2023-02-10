<script lang="ts">
  import { onMount } from "svelte";
  import {
    isAliveCells,
    isRun,
    itemSize,
    worldSize,
    worldState,
  } from "$lib/store/world";
  import Entity from "$lib/components/Entity.svelte";

  let frame;
  let stepCount = 1;
  let stepLength = 10;
  let startTime: number;
  const duration = 1000;
  const initialStepLength = stepLength;
  const isTimer = false;

  onMount(() => {
    let isInitialWorldSize = true;
    const worldChangeSubscriber = worldSize.subscribe((size) => {
      if (!isInitialWorldSize && $isRun) {
        stop();
        return;
      }
      isInitialWorldSize = false;
      worldState.updateWorldSize(size);
    });
    reset();
    return () => {
      cancelAnimationFrame(frame);
      worldChangeSubscriber();
    };
  });

  function loop() {
    stepCount += 1;
    const now = performance.now();
    const delta = Math.min((now - startTime) / duration, 1);
    if (stepCount % stepLength === 0) {
      worldState.toggleEntities();
    }
    if ($isRun && $isAliveCells && (delta < 1 || !isTimer)) {
      frame = requestAnimationFrame(loop);
    } else {
      $isRun = false;
      return;
    }
  }

  function start() {
    startTime = performance.now();
    $isRun = true;
    loop();
  }

  function stop() {
    $isRun = false;
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = undefined;
    startTime = undefined;
    $isRun = false;
    startTime = undefined;
    stepCount = 1;
    stepLength = initialStepLength;
    worldState.reset();
  }
</script>

<main>
  <div class="control-panel">
    <button on:click={start} class:active={$isRun}>Start</button>
    <button on:click={stop} class:active={!$isRun}>Stop</button>
    <button on:click={reset}>Reset</button>
    <label>
      <span>Item Size</span>
      <input
        type="range"
        step="0.5"
        min="0.5"
        max="10"
        bind:value={$itemSize}
      />
    </label>
    <label>
      <span>Step</span>
      <input
        type="number"
        min="1"
        max="1000"
        class="step-length"
        bind:value={stepLength}
      />
    </label>
    <label>
      <!-- Recomened max 100 -->
      <span>World size</span>
      <input type="number" min="1" max="100" bind:value={$worldSize} />
    </label>
    <span>Step: {stepCount}</span>
  </div>
  <div class="container">
    {#each Array($worldSize) as _, x}
      <div class="column">
        {#each Array($worldSize) as _, y}
          <Entity {x} {y} />
        {/each}
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: 100%;
  }
  .control-panel {
    position: fixed;
    background-color: lightslategrey;
    padding: 10px;
    width: 100%;
    color: white;
  }
  .container {
    display: flex;
    background-color: lightgray;
    padding: 70px 10px 10px 10px;
    margin: 0 auto;
  }
  .active {
    background-color: blue;
  }
</style>
