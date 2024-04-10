<script lang="ts">
    /** @type {import('./$types').PageData} */
    import API from "$lib/services/api";
    import CreditBrand from "./createBrand/+page.svelte";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import {toast} from "svelte-sonner";
    import BrandTable from "./brandTable.svelte";
    import {Button} from "$lib/components/ui/button"; 

    let showForm: boolean = false;
    let renderTable:boolean = false;

    function toggleForm() {
        showForm = !showForm
        renderTable =!renderTable
    }

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Brands</h4>
        <div class="glow-border mr-4">
            <Button variant="outline" class="text-xs flex items-center gap-2 border  px-4 py-1.5" on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Brand
            </Button>
        </div>
    </div>
    <BrandTable {showForm} />
</div>