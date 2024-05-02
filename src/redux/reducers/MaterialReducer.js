import { createSlice } from "@reduxjs/toolkit";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { materialService } from "../services/MaterialService";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  materialList: [],
  page: 0,
  limit: 10,
  totalPage: 0,
  loading: false,
  materialEdit: {},
};

const MaterialReducer = createSlice({
  name: "MaterialReducer",
  initialState,
  reducers: {
    setLoadingMaterials: (state, action) => {
      state.loading = action.payload;
    },
    setMaterialList: (state, action) => {
      state.materialList = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.page = action.payload;
    },
    setMaterialEdit: (state, action) => {
      state.materialEdit = action.payload;
    },
  },
});

export const {
  setMaterialList,
  setLimit,
  setMaterialEdit,
  setLoadingMaterials,
  setCurrentPage,
  setTotalPage,
} = MaterialReducer.actions;

export default MaterialReducer.reducer;

// ----------------------- CALL API -----------------//
export const getAllMetarialApi = (page, limit) => {
  return async (dispatch) => {
    dispatch(setLoadingMaterials(true));
    await dispatch(setLimit(limit));
    await dispatch(setCurrentPage(page));
    try {
      const result = await materialService.getAllMaterial(page, limit);
      if (result.status === STATUS_CODE.SUCCESS) {
        await dispatch(setMaterialList(result.data.materials));
        await dispatch(setTotalPage(result.data.totalPage));
      }
      dispatch(setLoadingMaterials(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const getAllMaterialNoPaging = () => {
  return async (dispatch) => {
    dispatch(setLoadingMaterials(true));
    try {
      const result = await materialService.getAllMaterialNoPaging();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setMaterialList(result.data));
      }
      dispatch(setLoadingMaterials(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const createMaterialApi = (data) => {
  return async (dispatch) => {
    dispatch(setLoadingMaterials(true));
    try {
      const result = await materialService.createMaterial(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Create material successfully!");
        dispatch(getAllMaterialNoPaging());
      }
      dispatch(setModalCancel());
      dispatch(setLoadingMaterials(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const deleteMaterialApi = (id) => {
  return async (dispatch) => {
    dispatch(setLoadingMaterials(true));
    try {
      const result = await materialService.deleteMaterial(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Delete material successfully!");
        dispatch(getAllMaterialNoPaging());
      }
      dispatch(setLoadingMaterials(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const getMaterialByIdApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await materialService.getMaterialById(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setMaterialEdit(result.data));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const uploadImageMaterialApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await materialService.uploadImageMaterial(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Upload image successfully!");
        dispatch(getMaterialByIdApi(data.id));
        return {
          status: STATUS_CODE.SUCCESS,
          data: result.data,
        };
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const editMaterialApi = (data) => {
  return async (dispatch) => {
    try {
      console.log("data", data);
      const result = await materialService.editMaterial(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Edit material successfully!");
        dispatch(getMaterialByIdApi(data.id));
        dispatch(getAllMaterialNoPaging());
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const assignTagToMaterialApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await materialService.assignTagToMaterial(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getMaterialByIdApi(data.material_id));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};
