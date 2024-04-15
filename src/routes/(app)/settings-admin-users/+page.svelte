<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import AdminTable from "./adminTable.svelte";

    let showForm: boolean = false;

    function toggleForm() {
        showForm = !showForm
    }

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
    <div class="flex items-center ">
        <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Admin Users</h4>
        <div class="glow-border mr-4">
            <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5" on:click={() => toggleForm()}>
                <span>
                    <i class="fa-solid fa-plus text-sm"></i>
                </span>New Admin
            </Button>
        </div>
    </div>
    <AdminTable {showForm}/>
</div>
