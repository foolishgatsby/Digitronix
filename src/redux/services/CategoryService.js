import { BaseService } from "./BaseService";

class CategoryService extends BaseService {
  getAllCategory = () => {
    return this.get("categories/getAll");
  };

  getAllCategoryMaterial = () => {
    return this.get("material_categories/getAll");
  };

  createCategory = (data) => {
    return this.post("categories", data);
  };

  deleteCategory = (id) => {
    return this.delete(`categories/${id}`);
  }

  updateCategory = (data) => {
    return this.put(`categories/${data.id}`, data);
  }

  createCategoryMaterial = (data) => {
    return this.post("material_categories", data);
  };

  deleteCategoryMaterial = (id) => {
    return this.delete(`material_categories/${id}`);
  }

  updateCategoryMaterial = (data) => {
    return this.put(`material_categories/${data.id}`, data);
  }
}

export const categoryService = new CategoryService();
