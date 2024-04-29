import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import {
  getAllCustomersAPI,
  getCustomerDetailsAPI,
} from "../../../redux/reducers/CustomerReducer";
import { NavLink } from "react-router-dom";
import { getOrdersByCustomerIdAPI } from "../../../redux/reducers/OrderReducer";

// css
import style from "./CustomerSale.module.css";

export default function CustomerSale(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    let Component = [
      {
        tooltip: "Favourite Customer",
        icon: `<i className="fa-solid fa-heart" />`,
        contentComponentType: "FavoriteCustomer",
        isFilterFunction: true,
      },
      {
        tooltip: "Add Customer",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormAddCustomer",
      },
    ];
    dispatch(setComponentsAction(Component));
    dispatch(getAllCustomersAPI());
  }, []);

  const { customerList } = useSelector((state) => state.CustomerReducer);

  return (
    <div>
      {customerList.map((customer, index) => {
        return (
          <div key={index} className={style.customerCard}>
            <div className="flex justify-between mb-2">
              <div>
                Customer's Name:{" "}
                <span className="font-semibold">{customer.name}</span>
              </div>
              <div>
                Address:{" "}
                <span className="font-semibold">{customer.address}</span>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                Phone number:{" "}
                <span className="font-semibold">{customer.phone}</span>
              </div>
              <div>{customer.facebook}</div>
            </div>
            <div className="text-end">
              <NavLink
                className="no-underline text-blue-500 hover:text-blue-700"
                to={`${customer.id}`}
                onClick={() => {
                  dispatch(getCustomerDetailsAPI(customer.id));
                  dispatch(getOrdersByCustomerIdAPI(customer.id));
                }}
              >
                Details
              </NavLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}
