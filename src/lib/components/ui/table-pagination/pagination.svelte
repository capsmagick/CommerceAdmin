<script lang="ts">
  import ChevronLeft from "svelte-radix/ChevronLeft.svelte";
  import ChevronRight from "svelte-radix/ChevronRight.svelte";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
 
 
export let totalItems:number;
export let per_page:number;

  $: count = totalItems;
  $: perPage =  per_page;
</script>
 
<Pagination.Root {count} {perPage} let:pages let:currentPage>
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.PrevButton on:click={() => dispatch("prev")}>
        <ChevronLeft class="h-4 w-4" />
        <span class="hidden sm:block">Previous</span>
      </Pagination.PrevButton>
    </Pagination.Item>
    {#each pages as page (page.key)}
      {#if page.type === "ellipsis"}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
      {:else}
        <Pagination.Item >
          <Pagination.Link on:click={() => dispatch("page", page.value)}
             {page} isActive={currentPage === page.value}>
            {page.value}
          </Pagination.Link>
        </Pagination.Item>
      {/if}
    {/each}
    <Pagination.Item>
      <Pagination.NextButton on:click={() => dispatch("next")}>
        <span class="hidden sm:block">Next</span>
        <ChevronRight class="h-4 w-4" />
      </Pagination.NextButton>
    </Pagination.Item>
  </Pagination.Content>
</Pagination.Root>