<script lang="ts">
  /** @type {import('./$types').PageData} */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import API from "$lib/services/api";
  import { Button } from "$lib/components/ui/button";
  import TagTable from "./tagTable.svelte";
  import CreateTag from "./createTag/+page.svelte";
  import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
  import {toast} from "svelte-sonner";

  let showDeleteModal = false;
    let deletingTag: any;
    let refreshTable;
    let editData;
    let showForm: boolean = false;
    let editForm: boolean = false;

    function toggleForm() {
        console.log(showForm)
        showForm = !showForm
    }

    async function onEditTag(eventData) {
        editData = eventData.original;
        showForm = true;
        editForm = true;
        console.log("Edit Tag ID : ",eventData.original.id);
    }

    async function onDeleteTag(eventData) {
        deletingTag = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/tag/${deletingTag.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting Tag:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshTable.refreshTable();
        toast("Tag Deleted Successfully!");
    }

    function handleNewTag() {
        editData = null;
        editForm = false;
        showForm = false;
        refreshTable.refreshTable();
    }
</script>
<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingTag.name} on:confirm={confirmDelete}
                            on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="abc">
    {#if showForm}
        <CreateTag
                {editData}
                {editForm}
                on:close={() => {editData = null;editForm = false;showForm = false;}}
                on:newTag={() => handleNewTag()}/>
    {/if}
</div>
<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
  <div class="flex items-center ">
      <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Tag</h4>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Tag</Button>
      </div>
      <div class="glow-border mr-4">
        <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
        <i class="fa-solid  fa-cloud-arrow-up text-sm"></i>
        Add Tag</Button>
      </div>
  </div>
  <TagTable on:newTag={() => toggleForm()}
                on:edit={(event) => onEditTag(event.detail.item.row)}
                on:delete={(event) => onDeleteTag(event.detail.item.row)}
                bind:this={refreshTable}/>
</div>