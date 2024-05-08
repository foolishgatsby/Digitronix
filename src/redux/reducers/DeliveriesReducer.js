import { createSlice } from "@reduxjs/toolkit";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { deliveriesService } from "../services/DeliveriesService";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  deliveriesList: [],
  deliveriesListLoading: false,
  deliveriesDetail: {},
};

const DeliveriesReducer = createSlice({
  name: "DeliveriesReducer",
  initialState,
  reducers: {
    setDeliveriesList: (state, action) => {
      state.deliveriesList = action.payload;
    },
    setDeliveriesListLoading: (state, action) => {
      state.deliveriesListLoading = action.payload;
    },
    setDeliveriesDetail: (state, action) => {
      state.deliveriesDetail = action.payload;
    },
  },
});

export const {
  setDeliveriesList,
  setDeliveriesListLoading,
  setDeliveriesDetail,
} = DeliveriesReducer.actions;

export default DeliveriesReducer.reducer;

// API
export const getDeliveryAPI = () => {
  return async (dispatch) => {
    dispatch(setDeliveriesListLoading(true));
    try {
      const result = await deliveriesService.getAllDeliveries();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setDeliveriesList(result.data));
      }
      dispatch(setDeliveriesListLoading(false));
    } catch (error) {
      console.log("error", error);
      dispatch(setDeliveriesListLoading(false));
    }
  };
};

export const addDeliveryAPI = (data) => {
  return async (dispatch) => {
    dispatch(setDeliveriesListLoading(true));
    try {
      const result = await deliveriesService.addDelivery(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Add delivery successfully!");
        dispatch(getDeliveryAPI());
      }
      dispatch(setDeliveriesListLoading(false));
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error);
      dispatch(setDeliveriesListLoading(false));
    }
  };
};

export const deleteDeliveryAPI = (deliveryId) => {
  return async (dispatch) => {
    dispatch(setDeliveriesListLoading(true));
    try {
      const result = await deliveriesService.deleteDelivery(deliveryId);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getDeliveryAPI());
      }
      dispatch(setDeliveriesListLoading(false));
    } catch (error) {
      console.log("error", error);
      dispatch(setDeliveriesListLoading(false));
    }
  };
};
