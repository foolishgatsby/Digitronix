import { BaseService } from "./BaseService";

class DataAccessService extends BaseService {

    getAllImportExport = () => {
        return this.get(`data_accesses`)
    }

    importExportProducts = (data) => {
        return this.post(`data_accesses`, data)
    }
}

export const dataAccessService = new DataAccessService();