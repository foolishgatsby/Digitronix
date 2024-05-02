import { createSlice } from "@reduxjs/toolkit";
import { dataAccessService } from "../services/DataAccessService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  importList: [],
  exportList: [],
  importMaterialList: [],
  exportMaterialList: [],
  loadingImportExport: false,
};

const DataAccess = createSlice({
  name: "DataAccess",
  initialState,
  reducers: {
    setImportList: (state, action) => {
      state.importList = action.payload;
    },
    setExportList: (state, action) => {
      state.exportList = action.payload;
    },
    setImportMaterialList: (state, action) => {
      state.importMaterialList = action.payload;
    },
    setExportMaterialList: (state, action) => {
      state.exportMaterialList = action.payload;
    },
    setLoadingImportExport: (state, action) => {
      state.loadingImportExport = action.payload;
    },
  },
});

export const {
  setImportList,
  setExportList,
  setLoadingImportExport,
  setImportMaterialList,
  setExportMaterialList,
} = DataAccess.actions;

export default DataAccess.reducer;

// Import Export Product Data API
export const getAllImportExportAPI = () => {
  return async (dispatch) => {
    dispatch(setLoadingImportExport(true));
    try {
      const res = await dataAccessService.getAllImportExport();
      if (res.status === STATUS_CODE.SUCCESS) {
        // console.log(res.data)
        const importList = res.data.filter((item) => item.status === true);
        const exportList = res.data.filter((item) => item.status === false);
        dispatch(setImportList(importList));
        dispatch(setExportList(exportList));
      }
      dispatch(setLoadingImportExport(false));
    } catch (error) {
      console.log(error);
    }
  };
};

export const importExportProductAPI = (data) => {
  return async (dispatch) => {
    try {
      const res = await dataAccessService.importExportProducts(data);
      if (
        res.status === STATUS_CODE.CREATED ||
        res.status === STATUS_CODE.SUCCESS
      ) {
        alert("Import Product to Warehouse");
        dispatch(getAllImportExportAPI());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log(error);
    }
  };
};

export const getAllImportExportMaterialAPI = () => {
  return async (dispatch) => {
    dispatch(setLoadingImportExport(true));
    try {
      const res = await dataAccessService.getAllImportExportMaterial();
      if (res.status === STATUS_CODE.SUCCESS) {
        // console.log(res.data)
        const importMaterialList = res.data.filter(
          (item) => item.access_status === true
        );
        const exportMaterialList = res.data.filter(
          (item) => item.access_status === false
        );
        dispatch(setImportMaterialList(importMaterialList));
        dispatch(setExportMaterialList(exportMaterialList));
      }
      dispatch(setLoadingImportExport(false));
    } catch (error) {
      console.log(error);
    }
  };
};

export const importExportMaterialAPI = (data) => {
  return async (dispatch) => {
    try {
      const res = await dataAccessService.importExportMaterials(data);
      if (
        res.status === STATUS_CODE.CREATED ||
        res.status === STATUS_CODE.SUCCESS
      ) {
        alert("Import Material to Warehouse");
        dispatch(getAllImportExportMaterialAPI());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log(error);
    }
  };
};
