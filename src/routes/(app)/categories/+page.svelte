<script lang="ts">
    /** @type {import('./$types').PageData} */

    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button";
    import CategoriesTable from "./categoriesTable.svelte";
    import CreditCategory from "./createCategory/+page.svelte"
    import {toast} from "svelte-sonner";
    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";


    let showDeleteModal = false;
    let deletingCategory: any;
    let refreshTable: any;
    let editData: any;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditCategory(eventData:any) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteCategory(eventData: any) {
        deletingCategory = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/category/${deletingCategory.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Category:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Category Deleted Successfully!");
    }

    function handleNewCategory() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingCategory.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreditCategory
                {editData}
                {editForm}
                on:close={() => {editData = null;editForm = false;showForm = false;}}
                on:newCategory={() => handleNewCategory()}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center " >
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Category</h4>
        <div class="glow-border mr-4">
            <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5"  on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Category
            </Button>
        </div>
    </div>
    <CategoriesTable on:newCategory={() => toggleForm()}
                     on:edit={(event) => onEditCategory(event.detail.item.row)}
                     on:delete={(event) => onDeleteCategory(event.detail.item.row)}
                     bind:this={refreshTable}/>
</div>