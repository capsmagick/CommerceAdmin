<script lang="ts">
     import * as Sheet from "$lib/components/ui/sheet/index";
     import { Button } from "$lib/components/ui/button";
     import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
 import { refreshtable } from '$lib/Functions/CRUD';
  import API from "$lib/services/api";
  import { toast } from "svelte-sonner";
    let name = "";
    let values = "";
    let id = "";
    let editForm = false;

    type editDatamodel={
       id:string;
    name:string;
    value:string;

    }
    export const editData: editDatamodel = {
      id: "",
      name: "",
      value: ""
    }

    async function EditAttribute(name:string, value:string) {
      
      try {
            const formData = {
                name,
                value: [value.replace(/\s/g, '')]
            };

            const url = editData.id
                ? `/masterdata/attribute/${id}/update_record/`
                : "/masterdata/attribute/create_record/";

            if (editForm) {
                await API.put(url, formData);
            } else {
                await API.post(url, formData);
            }

           

            const action = editForm ? "Attribute Updated" : "Attribute Created";

            toast(`${action} successfully!`);
        } catch (error) {
            const action = editForm ? "Update Attribute" : "Create Attribute";
            console.log(`${action}:`, error);
            toast(`Failed to ${action}`);
        }
}
async function NewAttribute(name:string, value:string) {
  try {
    const formData = {
      name,
      value: value.split(',').map(v => v.trim())
    };

    const url = "/masterdata/attribute/create_record/";

    const res = await API.post(url, formData);

    toast("Attribute Created successfully!");
    
    
  } catch (error) {
    console.error("Create Attribute:", error);
    toast("Failed to Create Attribute");
  }
}
  
    async function saveChanges() {
        console.log(name, values);
        await EditAttribute(name, values);
        await refreshtable();
        
    }
  </script>
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline">Add New</Button>
    </Sheet.Trigger>
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Add Attribute</Sheet.Title>
        <Sheet.Description>
          create new attributes here. Add multiple value seprated by comma.Click save when you're done.
        </Sheet.Description>
      </Sheet.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" bind:value={name} placeholder="Attribute Name" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="values" class="text-right">Values</Label>
          <Input id="values" bind:value={values} placeholder="Value1, Value2, Value3" class="col-span-3" />
        </div>
      </div>
      <Sheet.Footer>
        <Sheet.Close asChild let:builder>
          <Button builders={[builder]} type="submit" on:click={saveChanges}>Save changes</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Root>