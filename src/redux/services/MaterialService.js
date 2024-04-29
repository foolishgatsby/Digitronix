import { BaseService } from "./BaseService";

class MaterialService extends BaseService {
  getAllMaterial = (page, limit) => {
    return this.get(`materials/all?page=${page}&limit=${limit}`);
  };

  getAllMaterialNoPaging = () => {
    return this.get(`materials/allNoPaging`);
  }

  searchMaterial = (page, limit, keyword, category_id, tag) => {
    return this.get(
      `materials/search?page=${page}&limit=${limit}&keyword=${keyword}&category_id=${category_id}&tag=${tag}`
    );
  };

  getMaterialById = (id) => {
    return this.get(`materials/${id}`);
  }

  createMaterial = (data) => {
    return this.post(`materials`, data);
  };

  deleteMaterial = (id) => {
    return this.delete(`materials/${id}`);
  }

  uploadImageMaterial = (data) => {
    return this.post(`materials/${data.id}/image`, data.image);
  }

  editMaterial = (data) => {
    return this.put(`materials/${data.id}`, data);
  }

  assignTagToMaterial = (data) => {
    return this.post(`materials/${data.material_id}/tags/${data.tag_id}`);
  }

}

export const materialService = new MaterialService();
