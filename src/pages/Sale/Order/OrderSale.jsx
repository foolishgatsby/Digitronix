import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAPI } from "../../../redux/reducers/OrderReducer";
import { NavLink } from "react-router-dom";

import style from "./OrderSale.module.css";

export default function OrderSale(props) {
  const dispatch = useDispatch();

  const { orderList } = useSelector((state) => state.OrderReducer);

  useEffect(() => {
    // Get all orders
    dispatch(getAllOrdersAPI());
  }, []);

  return (
    <div>
      {orderList.map((order, index) => {
        return (
          <div key={index} className={style.orderCard}>
            <div className="flex justify-between mb-2">
              <div>
                <p>
                  Order ID: <span className="font-semibold">{order.id}</span>
                </p>
                <p>
                  Total Price:{" "}
                  <span className="font-semibold">{order.total_price}</span>
                </p>
              </div>
              <div>
                <p>
                  Customer Name:{" "}
                  <span className="font-semibold">{order.customer_name}</span>
                </p>
                <p>
                  Status: <span className="font-semibold">{order.status}</span>
                </p>
              </div>
              <div>
                <p>
                  Order Date:{" "}
                  <span className="font-semibold">{order.created_date}</span>
                </p>
                <p>
                  Payment Method:{" "}
                  <span className="font-semibold">{order.payment_method}</span>
                </p>
              </div>
              <div>
                <p>
                  Deadline:{" "}
                  <span className="font-semibold">{order.deadline}</span>
                </p>
                <p>
                  Delivery Method:{" "}
                  <span className="font-semibold">{order.delivery_method}</span>
                </p>
              </div>
            </div>
            <div className="text-end">
              <NavLink
                className="no-underline text-blue-500 hover:text-blue-700"
                to={`${order.id}`}
                onClick={() => {
                  // Get order details
                  // dispatch(getOrderDetailsAPI(order.id));
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
