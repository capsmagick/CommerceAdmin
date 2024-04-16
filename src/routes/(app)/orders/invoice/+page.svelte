<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import Template1 from "./template1/+page.svelte";

  function print() {
    window.print();
  }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center">
    <h4
      class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1"
    >
      Invoice
    </h4>
    <div class="glow-border mr-4">
      <Button
        variant="outline"
        class="text-xs flex items-center gap-2  px-4 py-1.5"
        on:click={print}
      >
        <span>
          <i class="fa-solid fa-print text-sm"></i>
        </span>Print
      </Button>
    </div>
  </div>
  <div class="p-5">
    <div class="border p-5">
      <Template1 />
    </div>
  </div>
</div>
