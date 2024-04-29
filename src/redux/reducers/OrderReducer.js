import { createSlice } from "@reduxjs/toolkit";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { orderService } from "../services/OrderService";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  orderList: [],
  orderDetails: {},
  orderListByCustomer: [],
  orderLoading: false,
};

const OrderReducer = createSlice({
  name: "OrderReducer",
  initialState,
  reducers: {
    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    setOrderListByCustomer: (state, action) => {
      state.orderListByCustomer = action.payload;
    },
    setOrderLoading: (state, action) => {
      state.orderLoading = action.payload;
    },
  },
});

export const {
  setOrderList,
  setOrderDetails,
  setOrderListByCustomer,
  setOrderLoading,
} = OrderReducer.actions;

export default OrderReducer.reducer;

// Order API
// Get All orders
export const getAllOrdersAPI = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const response = await orderService.getAllOrders();
      if (response.status === STATUS_CODE.SUCCESS) {
        dispatch(setOrderList(response.data));
      }
      dispatch(setOrderLoading(false));
    } catch (error) {
      console.log("error", error);
    }
  };
};

// get order by customer id
export const getOrdersByCustomerIdAPI = (customerId) => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const response = await orderService.getOrdersByCustomerId(customerId);
      if (response.status === STATUS_CODE.SUCCESS) {
        dispatch(setOrderListByCustomer(response.data));
      }
      dispatch(setOrderLoading(false));
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const addOrderApi = (data) => {
  return async (dispatch) => {
    try {
      const response = await orderService.addOrder(data);
      if (response.status === STATUS_CODE.SUCCESS) {
        alert("Add order successfully");
        dispatch(getOrdersByCustomerIdAPI(data.customer_id));
        dispatch(getAllOrdersAPI());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const deleteOrderAPI = (orderId) => {
  return async (dispatch) => {
    try {
      const response = await orderService.deleteOrder(orderId);
      if (response.status === STATUS_CODE.SUCCESS) {
        alert("Delete order successfully");
        dispatch(getAllOrdersAPI());
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const getOrderDetailsAPI = (orderId) => {
  return async (dispatch) => {
    try {
      const response = await orderService.getOrderDetails(orderId);
      if (response.status === STATUS_CODE.SUCCESS) {
        dispatch(setOrderDetails(response.data));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const updateOrderAPI = (data) => {
  return async (dispatch) => {
    try {
      const response = await orderService.updateOrder(data);
      if (response.status === STATUS_CODE.SUCCESS) {
        alert("Update order successfully");
        dispatch(getAllOrdersAPI());
        dispatch(getOrderDetailsAPI(data.id));
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error);
    }
  };
};
