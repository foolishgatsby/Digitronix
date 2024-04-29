import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrderAPI, getAllOrdersAPI } from "../../../redux/reducers/OrderReducer";
import { NavLink, useNavigate } from "react-router-dom";

import style from "./OrderSale.module.css";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { Dropdown, Popconfirm } from "antd";

export default function OrderSale(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderList } = useSelector((state) => state.OrderReducer);

  useEffect(() => {
    let Components = [
      {
        tooltip: "Add new order",
        icon: `<i className="fas fa-plus" />`,
        contentComponentType: "FormAddOrder",
      },
    ];
    dispatch(setComponentsAction(Components));
    // Get all orders
    dispatch(getAllOrdersAPI());
  }, []);

  return (
    <div>
      {orderList.map((order, index) => {
        return (
          <div key={index} className={style.orderCard}>
            <div className="text-end mb-2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "delete",
                      title: "Delete",
                      label: (
                        <Popconfirm
                          title="Are you sure to delete this order?"
                          onConfirm={() => {
                            dispatch(deleteOrderAPI(order.id));
                          }}
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
                        navigate(`${order.id}`);
                        // Get order details
                        // dispatch(getOrderDetailsAPI(order.id));
                      },
                    },
                  ],
                }}
              >
                <i className="fas fa-ellipsis"></i>
              </Dropdown>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p>
                  <span className="font-semibold">
                    Order ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold">
                    Total Price:</span>{" "}
                  {order.total_price} $
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">
                    Customer Name:</span>{" "}
                  {order.customer_name}
                </p>
                <p>
                  <span className="font-semibold">
                    Status:</span> {order.status}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">
                    Order Date:</span>{" "}
                  {order.created_date}
                </p>
                <p>
                  <span className="font-semibold">
                    Payment Method:</span>{" "}
                  {order.payment_method}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">
                    Deadline:</span>{" "}
                  {order.deadline}
                </p>
                <p>
                  <span className="font-semibold">
                    Delivery Method:</span>{" "}
                  {order.delivery_method}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
