<script lang="ts">
  import API from "$lib/services/api";
  import CreateAttributeGroup from './create-attributeGroup/+page.svelte';
  import { Button } from "$lib/components/ui/button";
  import AttributeGroupTable from "./attributeGroupTable.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import {toast} from "svelte-sonner";

    let showDeleteModal = false;
    let deletingAttributeGroup: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    // Edit Attribute
    async function onEditAttributeGroup(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
    }

    async function onDeleteAttributeGroup(eventData) {
        deletingAttributeGroup = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/attributegroup/${deletingAttributeGroup.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting AttributeGroup:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Attribute Group Deleted Successfully!");
    }

    function handleNewAttributeGroup() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAttributeGroup.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreateAttributeGroup
                {editData}
                {editForm}
                on:close={() => {editData = null;editForm = false;showForm = false;}}
                on:newAttributeGroup={() => handleNewAttributeGroup()}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Attribute Group</h4>
        <Button class="text-xs flex items-center gap-2 border  px-4 py-1.5" on:click={() => toggleForm()}>
            <span>
                <i class="fa-solid fa-plus text-sm"></i>
            </span>New Attribute Group
        </Button>
    </div>
    <AttributeGroupTable on:newAttributeGroup={() => toggleForm()}
                on:edit={(event) => onEditAttributeGroup(event.detail.item.row)}
                on:delete={(event) => onDeleteAttributeGroup(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>