import { API_DOMAIN } from "../../utils/constants/settingSystem";
import { BaseService } from "./BaseService";

class CustomerService extends BaseService {
    getAllCustomers() {
        return this.get(`customers`)
    }

    getCustomerDetails(customerId) {
        return this.get(`customers/${customerId}`)
    }

    createCustomer(data) {
        return this.post(`customers`, data)
    }

    updateCustomer(data) {
        return this.put(`customers/${data.id}`, data)
    }

    deleteCustomer(customerId) {
        return this.delete(`customers/${customerId}`)
    }

}

export const customerService = new CustomerService();