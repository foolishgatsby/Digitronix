import { createSlice } from "@reduxjs/toolkit";
import { tagService } from "../services/TagService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";
import { setModalCancel } from "./ModalReducer";

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
