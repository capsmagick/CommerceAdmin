<script lang="ts">
  import { UserStore } from "$lib/store/data";
  import { get } from "svelte/store";
  import ReusableButton from "../../../components/Reusable/Button.svelte";
  import API from "$lib/services/api";
  import { goto } from "$app/navigation";
  let login = {
    username: "admin",
    password: "1234",
  };

  async function loginFn(params: any) {
  try {
    const res = await API.post("/account/session/user/login/", {
      ...login,
    });

    // Check if res and res.data are defined
    if (!res || !res.data) {
      console.error("Invalid response from the server");
      return; // Exit the function if the response is not valid
    }

    const user = res.data.user;

    // Additional check for user object
    if (user && user.username) {
      UserStore.set(user);
      await goto('/dashboard'); // Navigate to the dashboard
    } else {
      console.error("User data is missing in the response");
    }
  } catch (error) {
    console.log("login:", error);
  }
}
</script>

<div class="mx-auto h-full flex items-center justify-center" style="width: 26rem;">
  <div class="w-full">
    <div class="h-full w-full flex flex-col flex-1 gap-4">
        <div class="text-gray-800 text-lg font-medium text-center">Login</div>
        <!-- Username -->
        <div class="">
          <label
            for="first-name"
            class="block text-sm font-medium leading-6 text-gray-500"
            >Username</label
          >
          <div class="mt-2">
            <input
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              bind:value={login.username}
            />
          </div>
        </div>
        <!-- Password -->
        <div class="">
          <label
            for="first-name"
            class="block text-sm font-medium leading-6 text-gray-500"
            >Username</label
          >
          <div class="mt-2">
            <input
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              class="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
              bind:value={login.password}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            on:click={loginFn}
            class="px-3 py-2 bg-blue-500 text-white">Login</button
          >
        </div>
    </div>
  </div>
</div>
