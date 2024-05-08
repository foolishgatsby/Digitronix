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

  updateProcess = (data) => {
    return this.put(`processes/${data.id}`, data);
  };

  updateProcessDetail = (data) => {
    return this.put(`process_details/${data.id}`, data);
  };
}

export const processService = new ProcessService();
