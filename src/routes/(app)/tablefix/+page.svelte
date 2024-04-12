<script lang="ts">
    /** @type {import('./$types').PageData} */
    import {Button} from "$lib/components/ui/button";
   // import Table from "./Table.svelte";
    import Form from '$lib/components/Forms/sample-form/sample-form.svelte';
   // import SForm from '$lib/components/Forms/CategoryForm/CategoryForm.svelte';


  

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center " >
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Category</h4>
        <div class="glow-border mr-4">
        <Form/>
            <!-- <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={openModal}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Category
            </Button> -->
        </div>
    </div>
    <!-- <Table /> -->
</div>


