export type attributeGroup = {
    id: string;
    name: string;
  }

  export type CategoriesType = {
    id:string,
    tags: string[],
    sub_category: string[],
    created_at: string,
    updated_at: string,
    deleted: boolean,
    deleted_at: string,
    name: string,
    description: string,
    handle: string,
    is_active: boolean,
    image: string | null | File,
    is_main_menu: boolean,
    is_top_category: boolean,
    created_by: string | null,
    updated_by: string | null,
    deleted_by: string | null,
    parent_category:string | null,
    attribute_group: string | null
  };

