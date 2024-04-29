import { createSlice } from "@reduxjs/toolkit";
import { productService } from "../services/ProductService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { setModalCancel } from "./ModalReducer";
import { tagService } from "../services/TagService";

const initialState = {
  productList: [],
  page: 0,
  limit: 10,
  totalPage: 0,
  loading: false,
  productEdit: {},
};

const ProductReducer = createSlice({
  name: "ProductReducer",
  initialState,
  reducers: {
    setLoadingProducts: (state, action) => {
      state.loading = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
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
    setProductEdit: (state, action) => {
      state.productEdit = action.payload;
    },
  },
});

export const {
  setProductList,
  setLoadingProducts,
  setTotalPage,
  setLimit,
  setCurrentPage,
  setProductEdit,
} = ProductReducer.actions;

export default ProductReducer.reducer;

// ----------------------- CALL API -----------------//
export const getAllProductApi = (page, limit) => {
  return async (dispatch) => {
    dispatch(setLoadingProducts(true));
    await dispatch(setLimit(limit));
    if (page === 0) await dispatch(setCurrentPage(0));
    else await dispatch(setCurrentPage(page));
    try {
      const result = await productService.getAllProduct(page, limit);
      // console.log("result", result);
      if (result.status === STATUS_CODE.SUCCESS) {
        await dispatch(setProductList(result.data.products));
        await dispatch(setTotalPage(result.data.totalPage));
        dispatch(setLoadingProducts(false));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const getAllProductNoPaging = () => {
  return async (dispatch) => {
    dispatch(setLoadingProducts(true));
    try {
      const result = await productService.getAllProductNoPaging();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setProductList(result.data))
      }
      dispatch(setLoadingProducts(false));
    } catch (error) {
      console.log("error", error.response.data)
    }
  }
}

export const getProductByIdApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productService.getProductById(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setProductEdit(result.data));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const searchProductApi = (page, limit, keyword, category_id, tag) => {
  return async (dispatch) => {
    dispatch(setLoadingProducts(true));
    await dispatch(setLimit(limit));
    await dispatch(setCurrentPage(page));
    try {
      const result = await productService.searchProduct(
        page,
        limit,
        keyword,
        category_id,
        tag
      );
      if (result.status === STATUS_CODE.SUCCESS) {
        await dispatch(setProductList(result.data.products));
        await dispatch(setTotalPage(result.data.totalPage));
        dispatch(setLoadingProducts(false));
      }
    } catch (error) { }
  };
};

export const createProductApi = (newProduct) => {
  return async (dispatch) => {
    try {
      const result = await productService.createProduct(newProduct);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Create product successfully!");
        dispatch(getAllProductNoPaging());
      }
      dispatch(setModalCancel());
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

// delete product api
export const deleteProductApi = (id) => {
  return async (dispatch) => {
    try {
      const result = await productService.deleteProduct(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllProductApi(0, 10));
      }
    } catch (error) {
      // if the error was the backend
      console.log(error.response?.data)
      // if the error was the axios
      console.log(error)
    }
  }
}

// edit product api
export const editProductApi = (editProduct) => {
  return async (dispatch) => {
    try {
      const result = await productService.editProduct(editProduct);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Edit product successfully!");
        dispatch(getProductByIdApi(editProduct.id));
        dispatch(getAllProductNoPaging());
      }
    } catch (error) {
      // if the error was the backend
      console.log(error.response?.data)
      // if the error was the axios
      console.log(error)
    }
  }
}

// upload image for product api
export const uploadImageApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await productService.uploadImage(data.id, data.img);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getProductByIdApi(data.id));
        return {
          status: STATUS_CODE.SUCCESS,
          data: result.data,
        };
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}

export const assignTagToProductApi = (data) => {
  return async (dispatch) => {
    try {
      const result = await tagService.assignTagToProduct(data.tag_id, data.product_id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getProductByIdApi(data.product_id));
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  }
}
