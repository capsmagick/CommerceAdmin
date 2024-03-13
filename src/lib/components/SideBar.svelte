<script>
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  let menus = [
    {
      name: "Dashboard",
      icon: "fa-house",
      route: "/dashboard",
      items: [
        { name: "Overview", page: "dashboard-overview" },
      ]
    },
    {
      name: "Sales",
      icon: "fa-cart-shopping",
      //route: "/orders",
      items: [
        { name: "Order Management", page: "orders" },
        { name: "Returns and Refunds", page: "orders-returns" },
        { name: "Invoices", page: "orders-invoices" },
      ]
    },
    {
      name: "Products",
      icon: "fa-tag",
      //route: "/products",
      items: [
        { name: "Categories", page: "categories" },
        { name: "Brands", page: "brands" },
        { name: "Collection", page: "collection" },
        { name: "Lookbook", page: "lookbook" },
        { name: "Attributes", page: "attributes" },
        { name: "Attribute Group", page: "attribute-group" },
      ]
    },
    {
      name: "Customers",
      icon: "fa-user",
      route: "/customers",
      items: [
        { name: "Customer Groups", page: "customer-groups" },
        { name: "Review and Rating", page: "reviews" }
      ]
    },
    {
      name: "Inventory",
      icon: "fa-warehouse",
      route: "/inventory",
      items: [
        { name: "purchase orders", page: "purchase-orders" },
        { name: "stock levels", page: "stock" },
        { name: "stock adjustments", page: "stock-adjustment" },
        { name: "stock transfers", page: "stock-transfer" },
      ]
    },
    {
      name: "Reports",
      icon: "fa-file-invoice",
      //route: "/inventory",
      items: [
        { name: "Sales Report", page: "sales-report" },
        { name: "Product Report", page: "product-report" },

      ]
    },
    // Add other menu groups following the same structure
    {
      name: "Settings",
      icon: "fa-gear",
      items: [
        { name: "General Settings", page: "settings-general" },
        { name: "Payment Methods", page: "settings-payment" },
        { name: "Shipping Methods", page: "settings-shipping" },
        { name: "Tax Configuration", page: "settings-tax" },
        { name: "Admin Users", page: "settings-admin-users" },
      ]
    },
    {
      name: "Help and Support",
      icon: "fa-circle-question",
      items: [
        { name: "Knowledge Base", page: "support-knowledge-base" },
        { name: "Contact Support", page: "support-contact" },
        { name: "System Status", page: "support-system-status" },
      ]
    },
  ];

  let activeMenu = null;

  function toggleMenu(index) {
  activeMenu = activeMenu === index ? null : index;
  // Navigate to the group's specified route if it exists
  if (menus[index].route) {
    goto(menus[index].route);
  }
}
</script>

<div class="md:flex hidden flex-col">
  <!-- Sidebar content -->
  <div class="flex flex-col p-4 gap-3">
    <div class="flex items-center  gap-2">
      <i class="fa-solid fa-store text-gray-900 w-8 h-8"></i>
      <div class="text-base text-gray-900">Store</div>
    </div>
    <div class="flex mt-10 flex-col gap-4 pl-2">
      {#each menus as menu, index}
        <button 
          on:click={() => toggleMenu(index)} 
          on:keydown={(event) => event.key === 'Enter' && toggleMenu(index)}
          class="flex items-center gap-2 text-gray-900 text-base py-2 cursor-pointer focus:outline-none"
          style="background: none; border: none; padding: 0; text-align: left;">
          <div class="w-4">
            <i class={`fa-solid text-gray-900 ${menu.icon}`}/>
          </div>
          {menu.name}
        </button>
        {#if activeMenu === index}
          <div transition:slide class="pl-4">
            {#each menu.items as item}
              <a href={item.page} class="text-gray-900 text-base py-1 block">{item.name}</a>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>