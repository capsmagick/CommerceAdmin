import API from "$lib/services/api";
import { attributeDataStore } from "../stores/data";





export async function fetchAttributes() {
    try {
      const res = await API.get("/masterdata/attribute/");
      return res.data.results;
    } catch (error) {
      console.error("fetch:attributes:", error);
      return [];
    }
  }

  export async function refreshtable(){
    const data = await fetchAttributes();
    attributeDataStore.set(data);
  }