<script lang="ts">
  import OrderTable from "./orderTable.svelte";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";
  import {toast} from "svelte-sonner";

    let refreshTable: any;


  async function orderProcessing(eventData: any) {
    let orderId = eventData.original.id;

    API.post(`orders/order/${orderId}/order-processing/`).then(()=>{
        toast.success("Order status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
  }

  async function orderPacking(eventData: any) {
    let orderId = eventData.original.id;

    API.post(`orders/order/${orderId}/packing/`).then(()=>{
        toast.success("Order status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
  }

  async function orderReadyForDispatch(eventData: any) {
    let orderId = eventData.original.id;

    API.post(`orders/order/${orderId}/ready-for-dispatch/`).then(()=>{
        toast.success("Order status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
  }

  async function orderShipped(eventData: any) {
    let orderId = eventData.original.id;

    API.post(`orders/order/${orderId}/shipped/`).then(()=>{
        toast.success("Order status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
  }

  async function orderDelivered(eventData: any) {
    let orderId = eventData.original.id;

    API.post(`orders/order/${orderId}/delivered/`).then(()=>{
        toast.success("Order status updated successfully");
        refreshTable.refreshTable();
      }).catch((error:any)=>{
        console.log(error)
      })
  }
    
</script>
    <div class="m-3 glow-border">
    <div class=" bg-background glow-border-content text-foreground  p-4 px-6" style="height: calc(100vh - 80px);">
        <div class="flex items-center justify-between">
            <h4 class="text-3xl font-bold tracking-tight  text-gray-800 dark:text-gray-200 flex-1">Orders</h4>
            <div class="glow-border mr-4">
                <Button variant="outline"  class="text-xs flex items-center gap-2  px-4 py-1.5">Export Customers</Button>
            </div>
           
        </div>
        <OrderTable bind:this={refreshTable}
                     on:processing={(event) => orderProcessing(event.detail.item.row)}
                     on:packing={(event) => orderPacking(event.detail.item.row)}
                     on:ready={(event) => orderReadyForDispatch(event.detail.item.row)}
                     on:shipped={(event) => orderShipped(event.detail.item.row)}
                     on:delivered={(event) => orderDelivered(event.detail.item.row)}
                    />
    </div>
</div>
