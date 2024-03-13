<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let label;
</script>

<button
  class="text-xs flex items-center gap-2 border border-blue-500 bg-blue-500 text-white px-4 py-1.5 rounded"
  on:click={() => dispatch("click")}
>
  {label}
</button>
