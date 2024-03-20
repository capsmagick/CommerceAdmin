  <script context="module" lang="ts">
    import * as Select from "$lib/components/ui/select";
    import { writable } from 'svelte/store';

    
     
    let data = writable<any>([]);
    let label: string;
   let triggerplaceholder: string;
    export let selectedItem: any;


    type Payload = {
    data:any,
    label: string,
    triggerplaceholder: string,
    selectedItem: any
  }  
  export let payload: any[] = [];

    async function handleChange(event:any) {
     selectedItem =event.value;
     return selectedItem;
     }
   
     
  </script>

        <Select.Root 
        onSelectedChange={handleChange}>
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder={triggerplaceholder} />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>{label}</Select.Label>
              {#each $data as typeof$data }
              <Select.Item  value={typeof$data.id ? typeof$data.id : "item1"} label={typeof$data.name}
                >{typeof$data.name}</Select.Item
              >
            {/each}
            </Select.Group>
          </Select.Content>
          <Select.Input name="selectedItem" bind:value={selectedItem} />
        </Select.Root>    
      
      
      
      
     
                  