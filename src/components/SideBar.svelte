<script>
  let tabs = [
    {
      name: "Orders",
      page: "Orders",
      icon: "fa-cart-shopping",
    },
    {
      name: "Products",
      page: "products",
      icon: "fa-tag",
    },
    {
      name: "Categories",
      page: "categories",
      icon: "fa-layer-group",
    },
    {
      name: "Customers",
      page: "customers",
      icon: "fa-users",
    },
    {
      name: "Discounts",
      page: "discounts",
      icon: "fa-percent",
    },
    {
      name: "Gift Cards",
      page: "gift-cards",
      icon: "fa-gift",
    },
    {
      name: "Pricing",
      page: "pricing",
      icon: "fa-indian-rupee-sign",
    },
    {
      name: "Settings",
      page: "settings",
      icon: "fa-gear",
    },
  ];
  
</script>

<div>
  <div class="flex items-center px-4 py-4 gap-2 border-b border-gray-600">
    <div
      class="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-bold text-xl rounded-full"
    >
      C
    </div>
    <h1 class="font-semibold text-white text-lg">Cart</h1>
  </div>
  <div class="flex flex-col p-4 gap-3">
    <div class="text-xs text-gray-200">
        Store
    </div>
    <div class="flex flex-col gap-4 pl-2">
        {#each tabs as tab, index }
        <div class="flex items-center gap-2 text-white text-sm py-2">
            <div class="w-4">
                <i class={`fa-solid text-gray-400 ${tab.icon}`}/>
            </div>
            { tab.name}
        </div>
        {/each}
    </div>
  </div>
</div>
