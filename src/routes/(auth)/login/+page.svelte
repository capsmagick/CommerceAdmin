<script lang="ts">
  import { UserStore } from "$lib/stores/data";
  import '../../../app.css';
  import logo from '$lib/images/SIGNUP_LOGO.png';
  import { get } from "svelte/store";
  import ReusableButton from "../../../components/Reusable/Button.svelte";
  import API from "$lib/services/api";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  let login = {
    username: "",
    password: "",
  };

  let Logo =logo;

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

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img class="mx-auto h-22 w-auto" src={Logo} alt="Signup Casuals">
    <!-- <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2> -->
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" >
      <div>
        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">User Name</label>
        <div class="mt-2">
          <Input  id="username" bind:value={login.username} name="username" type="text" autocomplete="username" required class="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </Input>
          </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="text-sm">
            <p class="font-normal text-violet-600 hover:text-violet-500">Forgot password? Contact Admin</p>
          </div>
        </div>
        <div class="mt-2 ">
          <Input id="password" bind:value={login.password} name="password" type="password" autocomplete="current-password" required class="block pl-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </Input>
          </div>
      </div>

      <div>
        <Button type="submit" on:click={loginFn} class="flex w-full justify-center  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in
        </Button>
        </div>
    </form>

    
  </div>
</div>