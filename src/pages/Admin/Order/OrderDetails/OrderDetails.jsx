import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import style from "../OrderAdmin.module.css";
import { getOrderDetailsAPI } from "../../../../redux/reducers/OrderReducer";
import { useParams } from "react-router";
import { Tag } from "antd";
import { setComponentsAction } from "../../../../redux/reducers/FunctionPopupReducer";

export default function OrderDetails(props) {
  const { id } = useParams()
  const dispatch = useDispatch();

  const { orderDetails } = useSelector((state) => state.OrderReducer);
  //   const { }

  useEffect(() => {
    let Components = [
      {
        tooltip: "Edit order",
        icon: `<i className="fas fa-edit" />`,
        contentComponentType: "FormEditOrder",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getOrderDetailsAPI(id))
  }, []);

  return <div>
    <h5>Order Information</h5>
    <div className="grid grid-cols-2">
      <div className="col-span-1">
        <p>Order ID: {orderDetails.id}</p>
        <p>Customer Name: {orderDetails.customer_name}</p>
        <p>Customer Address: {orderDetails.customerAddress}</p>
        <p>Customer Phone: {orderDetails.customerPhone}</p>
        <p>Status: <Tag color={
          orderDetails.status === "pending" ? "default" :
            orderDetails.status === "confirmed" ? "blue" :
              orderDetails.status === "on_produce" ? "green" :
                orderDetails.status === "on_delivery" ? "orange" : "red"
        } className="uppercase text-lg">{orderDetails.status}</Tag></p>
      </div>
      <div className="col-span-1">
        <p>Created Date: {orderDetails.created_date}</p>
        <p>Deadline: {orderDetails.deadline}</p>
        <p>Delivery Method: {orderDetails.delivery_method}</p>
        <p>Payment Method: {orderDetails.payment_method}</p>
        <p>Total Price: {orderDetails.total_price}</p>
      </div>
    </div >
    <h5><i className="fa fa-list" /> Product List:</h5>
    {
      orderDetails.orderDetailResponses?.map((orderDetail, index) => {
        return (
          <div key={index} className={style.orderCard}>
            <div className="mb-2">
              <p>Product ID: {orderDetail.product_id}</p>
              <p>Product Name: {orderDetail.product_name}</p>
              <p>Quantity: {orderDetail.quantity}</p>
            </div>
          </div>
        )
      })
    }

  </div >;
}
