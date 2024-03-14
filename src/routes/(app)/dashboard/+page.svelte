<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>
<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard Overview</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold">Total Sales</h2>
            <p class="text-lg">$24,000</p>
        </div>
        <div class="bg-green-500 text-white p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold">Orders</h2>
            <p class="text-lg">120</p>
        </div>
        <div class="bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold">New Customers</h2>
            <p class="text-lg">35</p>
        </div>
        <div class="bg-red-500 text-white p-4 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold">Pending Returns</h2>
            <p class="text-lg">5</p>
        </div>
    </div>
    <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Recent Orders</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-2">Order ID</th>
                        <th class="p-2">Date</th>
                        <th class="p-2">Status</th>
                        <th class="p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white border-b">
                        <td class="p-2">001</td>
                        <td class="p-2">2023-01-01</td>
                        <td class="p-2">Completed</td>
                        <td class="p-2">$300</td>
                    </tr>
                    <tr class="bg-gray-100 border-b">
                        <td class="p-2">002</td>
                        <td class="p-2">2023-01-02</td>
                        <td class="p-2">Processing</td>
                        <td class="p-2">$450</td>
                    </tr>
                    <!-- Add more rows as needed -->
                </tbody>
            </table>
        </div>
    </div>
</div>
