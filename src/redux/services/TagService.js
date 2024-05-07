import { BaseService } from "./BaseService";

class TagService extends BaseService {
  getAllTag = () => {
    return this.get("tags/all");
  };

  // assign tag to product
  assignTagToProduct = (tag_id, product_id) => {
    return this.post(`products/${product_id}/tags/${tag_id}`);
  };

  // remove tag from product
  removeTagFromProduct = (tag_id, product_id) => {
    return this.delete(`product_tags_mapping/${product_id}/tags/${tag_id}`);
  };

  // remove tag from material
  removeTagFromMaterial = (tag_id, material_id) => {
    return this.delete(`material_tags_mapping/${material_id}/tags/${tag_id}`);
  };

  deleteTag = (id) => {
    return this.delete(`tags/${id}`);
  };

  updateTag = (data) => {
    return this.put(`tags/${data.id}`, data);
  };

  createTag = (data) => {
    return this.post("tags", data);
  };
}

export const tagService = new TagService();
