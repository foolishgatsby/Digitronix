import { BaseService } from "./BaseService";

class OrderService extends BaseService {
  getAllOrders() {
    return this.get(`orders`);
  }

  getOrderDetails(orderId) {
    return this.get(`orders/${orderId}`);
  }

  getOrdersByCustomerId(customerId) {
    return this.get(`orders/customer/${customerId}`);
  }

  addOrder(data) {
    return this.post(`orders`, data);
  }

  deleteOrder(orderId) {
    return this.delete(`orders/${orderId}`);
  }

  updateOrder(data) {
    return this.put(`orders/${data.id}`, data);
  }
}

export const orderService = new OrderService();
