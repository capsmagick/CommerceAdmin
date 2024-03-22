<script lang="ts">
    /** @type {import('./$types').PageData} */

    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button";
    import AttributeTable from "./attributeTable.svelte";

    import CreditAttribute from "./createattributes/+page.svelte";
    import AttributeCRUD from "./attributeCrud.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index";
    import {refreshtable} from '$lib/Functions/CRUD';
    import {toast} from "svelte-sonner";

   let showDeleteModal = false;
    let deletingAttribute: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditAttribute(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteAttribute(eventData) {
        deletingAttribute = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/attribute/${deletingAttribute.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Attribute:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Attribute Deleted Successfully!");
    }

    function handleNewAttribute() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAttribute.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreditAttribute
                {editData}
                {editForm}
                on:close={() => {editData = null;editForm = false;showForm = false;}}
                on:newAttribute={() => handleNewAttribute()}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Attribute</h4>
        <div class="glow-border mr-4">
            <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Attribute
            </Button>
        </div>
    </div>
    <AttributeTable on:newAttribute={() => toggleForm()}
                    on:edit={(event) => onEditAttribute(event.detail.item.row)}
                    on:delete={(event) => onDeleteAttribute(event.detail.item.row)}
                    bind:this={refreshTable}/>
</div>