import { BaseService } from "./BaseService";

class ProductionsService extends BaseService {
  getAllProductions = () => {
    return this.get("productions");
  };

  addProduction = (data) => {
    return this.post("productions", data);
  };

  deleteProduction = (id) => {
    return this.delete(`productions/${id}`);
  };

  updateProduction = (data) => {
    return this.put(`productions/${data.id}`, data);
  };

  createProductionDetail = (data) => {
    return this.post("production_details", data);
  };

  getProductionById = (id) => {
    return this.get(`productions/${id}`);
  };

  getProductionDetailById = (id) => {
    return this.get(`production_details/${id}`);
  };

  updateProductionDetail = (data) => {
    return this.put(`production_details/${data.id}`, data);
  };

  deleteProductionDetail = (id) => {
    return this.delete(`production_details/${id}`);
  };
}

export const productionsService = new ProductionsService();
