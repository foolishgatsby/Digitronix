import { createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/UserService";
import {
  STATUS_CODE,
  TOKEN,
  USER_ID,
  USER_NAME,
  USER_ROLE,
} from "../../utils/constants/settingSystem";

// setting const

const initialState = {
  userLoginInfo: {},
};

const LoginReducer = createSlice({
  name: "LoginReducer",
  initialState,
  reducers: {
    setUserInfoAction: (state, action) => {
      const { roleId, token, userId, username } = action.payload;
      localStorage.setItem(USER_ROLE, roleId);
      localStorage.setItem(TOKEN, token);
      localStorage.setItem(USER_ID, userId);
      localStorage.setItem(USER_NAME, username);
      state.userLoginInfo = action.payload;
    },
  },
});

export const { setUserInfoAction } = LoginReducer.actions;

export default LoginReducer.reducer;

// *************** REDUX THUNK CALL API **************** //

/**
 * login funtion
 * @param {} userLogin
 * @returns
 */
export const loginApi = (userLogin) => {
  return async (dispatch) => {
    try {
      const result = await userService.login(userLogin);
      if (result.status === STATUS_CODE.SUCCESS) {
        localStorage.setItem(TOKEN, result.data.token);
        dispatch(setUserInfoAction(result.data));
      }
      // console.log(result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const logoutApi = () => {
  return async (dispatch) => {
    try {
      localStorage.clear();
      dispatch(setUserInfoAction({}));
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};
