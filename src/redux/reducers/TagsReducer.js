import { createSlice } from "@reduxjs/toolkit";
import { tagService } from "../services/TagService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { setModalCancel } from "./ModalReducer";
import { getProductByIdApi } from "./ProductReducer";
import { getMaterialByIdApi } from "./MaterialReducer";

const initialState = {
  tagList: [],
  loading: false,
  editTag: {},
};

const TagsReducer = createSlice({
  name: "TagsReducer",
  initialState,
  reducers: {
    setTagList: (state, action) => {
      state.tagList = action.payload;
    },
    setEditTag: (state, action) => {
      state.editTag = action.payload;
    },
    setLoadingTags: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTagList, setEditTag, setLoadingTags } = TagsReducer.actions;

export default TagsReducer.reducer;

// ----------------------- CALL API -----------------//

export const getAllTagsApi = () => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.getAllTag();
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(setTagList(result.data));
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};
export const createTagsApi = (data) => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.createTag(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Create tag success");
        dispatch(getAllTagsApi());
        dispatch(setModalCancel());
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const updateTagsApi = (data) => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.updateTag(data);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllTagsApi());
        dispatch(setModalCancel());
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const deleteTagsApi = (id) => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.deleteTag(id);
      if (result.status === STATUS_CODE.SUCCESS) {
        alert("Delete tag success");
        dispatch(getAllTagsApi());
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const removeTagFromProductApi = (tag_id, product_id) => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.removeTagFromProduct(tag_id, product_id);
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllTagsApi());
        dispatch(getProductByIdApi(product_id));
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const removeTagFromMaterialApi = (tag_id, material_id) => {
  return async (dispatch) => {
    dispatch(setLoadingTags(true));
    try {
      const result = await tagService.removeTagFromMaterial(
        tag_id,
        material_id
      );
      if (result.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllTagsApi());
        dispatch(getMaterialByIdApi(material_id));
      }
      dispatch(setLoadingTags(false));
    } catch (error) {
      console.log("error", error);
    }
  };
};
