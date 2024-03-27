import { writable } from "svelte/store";

type Attribute = {
    id: string;
    name: string;
    value: string [];
};



export const UserStore = writable({})
export const attributeDataStore = writable<Attribute[]>([]);
export const productIdStore = writable(null);

