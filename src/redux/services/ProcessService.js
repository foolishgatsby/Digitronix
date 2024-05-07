import { BaseService } from "./BaseService";

class ProcessService extends BaseService {
  getAllProcess = () => {
    return this.get("processes/all");
  };

  getProcessByProductId = (productId) => {
    return this.get(`processes/product/${productId}`);
  };

  createProcess = (data) => {
    return this.post("processes", data);
  };

  getProcessById = (processId) => {
    return this.get(`processes/${processId}`);
  };

  addProcessDetail = (data) => {
    return this.post("process_details", data);
  };

  deleteProcess = (processId) => {
    return this.delete(`processes/${processId}`);
  };

  deleteProcessDetail = (processDetailId) => {
    return this.delete(`process_details/${processDetailId}`);
  };
}

export const processService = new ProcessService();
