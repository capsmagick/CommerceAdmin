<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Select } from "$lib/components/ui/select";
  import { Button } from "$lib/components/ui/button";
  import API from "$lib/services/api";

  //
  let brandDetails = {
    name: "test name",
    logo: "",
    description: "Description ",
  };
  let imageUpload: any;
  let logo: any;

  //
  //   Logo upload
  function pickAvatar() {
    imageUpload.click();
  }
  async function uploadAvatar() {
    logo = imageUpload.files[0];
    const img: any = document.getElementById("selected-logo");
    img.src = window.URL.createObjectURL(logo);
  }

  async function createBrand() {
    try {
      const form = new FormData();
      form.append("logo", logo);
      form.append("name", brandDetails.name);
      form.append("description", brandDetails.description);
      console.log(form);
      await API.post("/masterdata/brand/create_record/", form);
    } catch (error) {
      console.log("create:brand:", error);
    }
  }
</script>

<div class="m-3">
  <div
    class="bg-white rounded-md p-4 px-6 border overflow-y-auto"
    style="height: calc(100vh - 58px);"
  >
    <div class="container mx-auto max-w-4xl py-8 px-4">
      <h2 class="text-3xl font-bold mb-6 text-center">Add Brand</h2>
      <form
        on:submit|preventDefault={createBrand}
        class="space-y-6 bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"
      >
        <Input
          bind:value={brandDetails.name}
          placeholder="Name"
          class="input"
        />
        <Textarea
          bind:value={brandDetails.description}
          placeholder="Description"
          class="textarea"
        />
        <div class="flex items-center gap-2">
          <Button
            type="button"
            class="btn flex gap-2 items-center bg-indigo-500 text-white text-xs"
            on:click={pickAvatar}
            ><i class="fa-solid fa-image text-sm"></i>Upload Logo</Button
          >
            <img
              id="selected-logo"
              alt=""
              class={ logo ? 'showImg':'hideImg'}
            />
        </div>
        <input
          type="file"
          id="file-input"
          bind:this={imageUpload}
          hidden
          accept="image/png, image/jpeg"
          on:input={uploadAvatar}
        />
        <Button type="submit" class="btn">Submit</Button>
      </form>
    </div>
  </div>
</div>
<style>
  .hideImg{
    visibility: hidden;
  }
  .showImg{
    display: block;
    height: 6rem;
    width: 6rem;
    flex: none;
    border-radius: 20px;
    object-fit: cover;
  }
</style>
