import { createSlice } from "@reduxjs/toolkit";
import { productService } from "../services/ProductService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { productionsService } from "../services/ProductionsService";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  productionList: [],
  productionEdit: {},
  productionDetailEdit: {},
};

const ProductionReducer = createSlice({
  name: "ProductionReducer",
  initialState,
  reducers: {
    setProductionList: (state, action) => {
      state.productionList = action.payload;
    },
    setProductionEdit: (state, action) => {
      state.productionEdit = action.payload;
    },
    setProductionDetailEdit: (state, action) => {
      state.productionDetailEdit = action.payload;
    },
  },
});

export const { setProductionList, setProductionEdit, setProductionDetailEdit } =
  ProductionReducer.actions;

export default ProductionReducer.reducer;

// ----------------------- CALL API -----------------//
export const getAllProductionApi = () => {
  return async (dispatch) => {
    try {
      const result = await productionsService.getAllProductions();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setProductionList(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const addProductionApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.addProduction(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllProductionApi());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteProductionApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.deleteProduction(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllProductionApi());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateProductionApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.updateProduction(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllProductionApi());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log(error);
    }
  };
};

export const createProductionDetailApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.createProductionDetail(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllProductionApi());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProductionByIdApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.getProductionById(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setProductionEdit(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProductionDetailByIdApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.getProductionDetailById(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setProductionDetailEdit(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const editProductionDetailAPI = (data) => {
  return async (dispatch) => {
    console.log("data", data);
    try {
      const result = await productionsService.updateProductionDetail(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Update success");
        dispatch(getAllProductionApi());
        dispatch(getProductionDetailByIdApi(data.id));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteProductionDetailApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productionsService.deleteProductionDetail(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Delete success");
        dispatch(getAllProductionApi());
      }
    } catch (error) {
      console.log(error);
    }
  };
};
