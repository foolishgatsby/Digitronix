import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import {
  deleteCustomerAPI,
  getAllCustomersAPI,
  getCustomerDetailsAPI,
} from "../../../redux/reducers/CustomerReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { getOrdersByCustomerIdAPI } from "../../../redux/reducers/OrderReducer";

// css
import style from "./CustomerSale.module.css";
import { Dropdown, Popconfirm } from "antd";

export default function CustomerSale(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let Component = [
      // {
      //   tooltip: "Favourite Customer",
      //   icon: `<i className="fa-solid fa-heart" />`,
      //   contentComponentType: "FavoriteCustomer",
      //   isFilterFunction: true,
      // },
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
            <div className="text-end mb-2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "delete",
                      title: "Delete",
                      label: (
                        <Popconfirm
                          title="Are you sure to delete this customer?"
                          onConfirm={() => {
                            dispatch(deleteCustomerAPI(customer.id));
                          }
                          }
                          okText="Yes"
                          cancelText="No"
                        >
                          Delete
                        </Popconfirm>
                      ),
                    },
                    {
                      key: "details",
                      title: "See details",
                      label: "Details",
                      onClick: () => {
                        navigate(`${customer.id}`);
                        dispatch(getCustomerDetailsAPI(customer.id));
                        dispatch(getOrdersByCustomerIdAPI(customer.id));
                        // Get order details
                        // dispatch(getOrderDetailsAPI(order.id));
                      },
                    },
                  ],
                }}
              >
                <i className="fas fa-ellipsis"></i>
              </Dropdown>
              {/* <NavLink
                className="no-underline text-blue-500 hover:text-blue-700"
                to={`${customer.id}`}
                onClick={() => {
                  dispatch(getCustomerDetailsAPI(customer.id));
                  dispatch(getOrdersByCustomerIdAPI(customer.id));
                }}
              >
                Details
              </NavLink> */}
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-semibold">
                  Customer's Name:</span>{" "}
                {customer.name}
              </div>
              <div>
                <span className="font-semibold">
                  Address:</span>{" "}
                {customer.address}
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-semibold">
                  Phone number:</span>{" "}
                {customer.phone}
              </div>
              <div>
                <span className="font-semibold">
                  Facebook:</span>{" "}
                {customer.facebook}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
