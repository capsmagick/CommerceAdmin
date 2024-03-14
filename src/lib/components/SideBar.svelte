<script lang="ts">
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
      route: "/products",
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

  let activeMenu: number | null = null;// intended to be `number | null`

  function toggleMenu(index: number) {
  const menu = menus[index];
  if (menu.route) {
    navigateTo(menu.route); // Navigate if there's a route
    activeMenu = index; // Ensure the submenu is opened
  } else {
    activeMenu = activeMenu === index ? null : index; // Toggle visibility of items
  }
}

  function navigateTo(page: string) {
    goto(page);
  }
</script>

<div class="md:flex hidden flex-col bg-gray-800 text-white h-full">
  <div class="flex flex-col p-4 gap-3">
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-store w-8 h-8"></i>
      <div class="text-lg">Store</div>
    </div>
    <div class="flex flex-col gap-4 pl-2 mt-10">
      {#each menus as menu, index}
        <div>
          <button 
            on:click={() => toggleMenu(index)} 
            class="flex items-center gap-2 py-2 cursor-pointer focus:outline-none hover:bg-gray-700 rounded-md px-2 w-full text-left"
          >
            <i class={`fa-solid ${menu.icon}`}></i>
            {menu.name}
          </button>
          {#if activeMenu === index}
            <div class="pl-4">
              {#each menu.items as item}
                <button 
                  on:click={() => navigateTo(item.page)} 
                  class="block py-1 cursor-pointer focus:outline-none hover:bg-gray-700 rounded-md px-2 text-sm w-full text-left"
                >
                  {item.name}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>