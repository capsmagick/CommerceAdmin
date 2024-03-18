<script lang="ts">
    /** @type {import('./$types').PageData} */

    import ConfirmDeleteModal from "$lib/components/ui/confirmation-modal/ConfirmDeleteModal.svelte";
    import API from "$lib/services/api";
    import {Button} from "$lib/components/ui/button";
    import AttributeTable from "./attributeTable.svelte";
    import AttributeCRUD from "./AttributeCRUD.svelte";
    import * as Sheet from "$lib/components/ui/sheet/index";
    import {refreshtable} from '$lib/Functions/CRUD';

    import {toast} from "svelte-sonner";


    let showDeleteModal = false;
    let deletingAttribute: any;

    let editData: any = null;
    let editForm: boolean = false;

    async function onEditAttribute(eventData) {
        editData = eventData.original;
        console.log('edit, ', editData)
        editForm = true
        setTimeout(() => {
            const addButton = document.querySelector('.add-new-button');
            if (addButton) addButton.click();
        }, 0);
    }

    async function onDeleteAttribute(eventData) {
        deletingAttribute = eventData.original;
        showDeleteModal = true;
    }

    function confirmDelete() {
        API.delete(`/masterdata/attribute/${deletingAttribute.id}/delete_record/`).then(() => {
            closeDeleteModal();
        }).catch((error) => {
            console.error("Error deleting attribute:", error);
            closeDeleteModal();
        });
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        refreshtable();
        toast("Attribute Deleted Successfully!");
    }

    function clearData(){
        editForm = false
    }

</script>

<div>
    {#if showDeleteModal}
        <ConfirmDeleteModal attribute={deletingAttribute.name} on:confirm={confirmDelete} on:cancel={closeDeleteModal}/>
    {/if}
</div>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Attributes</h4>
        <AttributeCRUD
                on:editSuccess={() => clearData()}
                {editData}
                {editForm}>
            <div slot="additionalButton">
                <Sheet.Trigger asChild let:builder>
                    <Button class="add-new-button" builders={[builder]} variant="outline">Add New</Button>
                </Sheet.Trigger>
            </div>
        </AttributeCRUD>
    </div>
    <AttributeTable
            on:edit={(event) => onEditAttribute(event.detail.item.row)}
            on:delete={(event) => onDeleteAttribute(event.detail.item.row)}/>

</div>