<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>

<div class=" p-10">
  <div class="grid py-5 grid-cols-2">
    <div>
      <p>Bill From:</p>
      <p class="text-xl">Signup Casuals</p>
      <p>(address)</p>
    </div>
    <div class="flex justify-end">
      <!-- <img src="" alt="logo"> -->
      logo
    </div>
  </div>
  <hr />
  <div class="grid py-5 grid-cols-2">
    <div>
      <p>Bill To:</p>
      <p class="text-xl">Customer Name</p>
      <p>(address)</p>
    </div>
    <div class="flex justify-end">
      <div>
        <p>INVOICE:</p>
        <p>Date:</p>
      </div>
      <div class="ml-5">
        <p>INV-0000000000</p>
        <p>01-01-2024</p>
      </div>
    </div>
  </div>
  <div class="py-5">
    <Table.Root>
      <Table.Caption></Table.Caption>
      <Table.Header class="bg-gray-100">
        <Table.Row>
          <Table.Head>Item</Table.Head>
          <Table.Head>Quantity</Table.Head>
          <Table.Head>Rate</Table.Head>
          <Table.Head>Tax</Table.Head>
          <Table.Head>Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Product 1</Table.Cell>
          <Table.Cell>2</Table.Cell>
          <Table.Cell>2500</Table.Cell>
          <Table.Cell>5%</Table.Cell>
          <Table.Cell>5250</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  </div>
  <hr />
  <div class="grid py-5 grid-cols-2">
    <div></div>
    <div class="flex justify-end">
      <div>
        <p>Sub Total:</p>
        <p>Discount:</p>
        <p>Tax:</p>
        <p>Paid:</p>
        <p class=" font-semibold">Total:</p>
      </div>
      <div class="ml-5 text-right">
        <p>$5000</p>
        <p>$0.00</p>
        <p>$250.00</p>
        <p>$0.00</p>
        <p class=" font-semibold">$5250</p>
      </div>
    </div>
  </div>
</div>
