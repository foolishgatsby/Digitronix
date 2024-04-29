import { BaseService } from "./BaseService";

class DeliveriesService extends BaseService {
  getAllDeliveries() {
    return this.get(`deliveries`);
  }

  getDeliveryDetails(deliveryId) {
    return this.get(`deliveries/${deliveryId}`);
  }

  addDelivery(data) {
    return this.post(`deliveries`, data);
  }

  deleteDelivery(deliveryId) {
    return this.delete(`deliveries/${deliveryId}`);
  }

  updateDelivery(data) {
    return this.put(`deliveries/${data.id}`, data);
  }
}

export const deliveriesService = new DeliveriesService();
