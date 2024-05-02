import { BaseService } from "./BaseService";

class DataAccessService extends BaseService {
  getAllImportExport = () => {
    return this.get(`data_accesses`);
  };

  getAllImportExportMaterial = () => {
    return this.get(`data_accesses/material/all`);
  };

  exportexcelProduct = () => {
    return this.get(`data_accesses/export/excel`);
  };

  exportexcelMaterial = () => {
    return this.get(`data_accesses/material/export`);
  };

  importExportProducts = (data) => {
    return this.post(`data_accesses`, data);
  };

  importExportMaterials = (data) => {
    return this.post(`data_accesses/material`, data);
  };
}

export const dataAccessService = new DataAccessService();
