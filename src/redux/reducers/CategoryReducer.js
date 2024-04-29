import { createSlice } from "@reduxjs/toolkit";
import { categoryService } from "../services/CategoryService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { setModalCancel } from "./ModalReducer";

const initialState = {
  categoryList: [],
  editCategory: {},
  categoryMaterialList: [],
  editCategoryMaterial: {},
};

const CategoryReducer = createSlice({
  name: "CategoryReducer",
  initialState,
  reducers: {
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setCategoryMaterialList: (state, action) => {
      state.categoryMaterialList = action.payload;
    },
    setEditCategory: (state, action) => {
      state.editCategory = action.payload;
    },
    setEditCategoryMaterial: (state, action) => {
      state.editCategoryMaterial = action.payload;
    }
  },
});

export const { setCategoryList, setCategoryMaterialList, setEditCategory, setEditCategoryMaterial } =
  CategoryReducer.actions;

export default CategoryReducer.reducer;

// ----------------------- CALL API -----------------//

export const getAllCategoryApi = () => {
  return async (dispatch) => {
    try {
      const result = await categoryService.getAllCategory();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setCategoryList(result.data));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const getAllCategoryMaterialApi = () => {
  return async (dispatch) => {
    try {
      const result = await categoryService.getAllCategoryMaterial();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setCategoryMaterialList(result.data));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const createCategoryApi = (category) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.createCategory(category);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Create category successfully");
        dispatch(getAllCategoryApi());
      }
      // close modal
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
}

export const deleteCategoryApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.deleteCategory(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Delete category successfully");
        dispatch(getAllCategoryApi());
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}

export const updateCategoryApi = (category) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.updateCategory(category);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Update category successfully");
        dispatch(getAllCategoryApi());
      }
      // close modal
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}

export const createCategoryMaterialApi = (category) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.createCategoryMaterial(category);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Create category successfully");
        dispatch(getAllCategoryMaterialApi());
      }
      // close modal
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
}

export const deleteCategoryMaterialApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.deleteCategoryMaterial(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Delete category successfully");
        dispatch(getAllCategoryMaterialApi());
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}

export const updateCategoryMaterialApi = (category) => {
  return async (dispatch) => {
    try {
      const result = await categoryService.updateCategoryMaterial(category);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Update category successfully");
        dispatch(getAllCategoryMaterialApi());
      }
      // close modal
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}