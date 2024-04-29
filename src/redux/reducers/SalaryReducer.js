import { createSlice } from "@reduxjs/toolkit";
import { salaryService } from "../services/SalaryService";
import { STATUS_CODE } from "../../utils/constants/settingSystem";

const initialState = {
  salaryList: [],
};

const SalaryReducer = createSlice({
  name: "SalaryReducer",
  initialState,
  reducers: {
    setSalaryList: (state, action) => {
      state.salaryList = action.payload;
    },
  },
});

export const { setSalaryList } = SalaryReducer.actions;

export default SalaryReducer.reducer;

// API
export const getAllSalaries = () => {
  return async (dispatch) => {
    try {
      const res = await salaryService.getAllSalaries();
      if (res.status === STATUS_CODE.SUCCESS) {
        dispatch(setSalaryList(res.data));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const updateSalryAPI = (data) => {
  return async (dispatch) => {
    try {
      const res = await salaryService.updateSalary(data);
      if (res.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllSalaries());
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

export const timekeepingAPI = () => {
  return async (dispatch) => {
    try {
      const res = await salaryService.timekeeping();
      if (res.status === STATUS_CODE.SUCCESS) {
        dispatch(getAllSalaries());
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

