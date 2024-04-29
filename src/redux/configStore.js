import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "./reducers/LoginReducer";
import FunctionPopupReducer from "./reducers/FunctionPopupReducer";
import UserReducer from "./reducers/UserReducer";
import RoleReducer from "./reducers/RoleReducer";
import ModalReducer from "./reducers/ModalReducer";
import ProductReducer from "./reducers/ProductReducer";
import CategoryReducer from "./reducers/CategoryReducer";
import TagsReducer from "./reducers/TagsReducer";
import MaterialReducer from "./reducers/MaterialReducer";
import ProcessReducer from "./reducers/ProcessReducer";
import CustomerReducer from "./reducers/CustomerReducer";
import OrderReducer from "./reducers/OrderReducer";
import DataAccess from "./reducers/DataAccess";
import ProductionReducer from "./reducers/ProductionReducer";
import DeliveriesReducer from "./reducers/DeliveriesReducer";
import SalaryReducer from "./reducers/SalaryReducer";

export const store = configureStore({
  reducer: {
    // reducer
    LoginReducer: LoginReducer,
    FunctionPopupReducer: FunctionPopupReducer,
    UserReducer: UserReducer,
    RoleReducer: RoleReducer,
    ModalReducer: ModalReducer,
    ProductReducer: ProductReducer,
    CategoryReducer: CategoryReducer,
    TagsReducer: TagsReducer,
    MaterialReducer: MaterialReducer,
    ProcessReducer: ProcessReducer,
    CustomerReducer: CustomerReducer,
    OrderReducer: OrderReducer,
    DataAccess: DataAccess,
    ProductionReducer: ProductionReducer,
    DeliveriesReducer: DeliveriesReducer,
    SalaryReducer: SalaryReducer,
  },
});
