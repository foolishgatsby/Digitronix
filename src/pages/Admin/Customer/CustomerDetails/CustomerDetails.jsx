import { Table, Tag } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByCustomerIdAPI } from "../../../../redux/reducers/OrderReducer";
import { setComponentsAction } from "../../../../redux/reducers/FunctionPopupReducer";

const columns = [
  {
    title: "Order ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Created Date",
    dataIndex: "created_date",
    key: "created_date",
    render: (text, record) => {
      return new Date(text).toLocaleDateString();
    },
  },
  {
    title: "Lead Time",
    dataIndex: "deadline",
    key: "deadline",
    render: (text, record) => {
      return new Date(text).toLocaleDateString();
    },
  },
  {
    title: "Total Price",
    dataIndex: "total_price",
    key: "total_price",
    render: (text, record) => {
      return text.toLocaleString() + " USD";
    },
  },
  {
    title: "Created By",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Customer Name",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Payment Method",
    dataIndex: "payment_method",
    key: "payment_method",
  },
  {
    title: "Delivery Method",
    dataIndex: "delivery_method",
    key: "delivery_method",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      switch (text) {
        case "pending":
          return <Tag color="orange">Pending</Tag>;
        case "confirmed":
          return <Tag color="green">Confirmed</Tag>;
        case "on_produce":
          return <Tag color="blue">On Produce</Tag>;
        case "on_delivery":
          return <Tag color="blue">On Delivery</Tag>;
        case "delivered":
          return <Tag color="green">Delivered</Tag>;
        case "reject":
          return <Tag color="red">Reject</Tag>;
        default:
          return <Tag color="orange">Pending</Tag>;
      }
    },
  },
];

export default function CustomerDetails(props) {
  const dispatch = useDispatch();
  const { customerDetails } = useSelector((state) => state.CustomerReducer);
  const { orderListByCustomer, orderLoading } = useSelector(
    (state) => state.OrderReducer
  );

  useEffect(() => {
    let Component = [
      {
        tooltip: "Edit Customer Information",
        icon: `<i className="fa fa-edit" />`,
        contentComponentType: "FormEditCustomerInformation",
      },
      {
        tooltip: "Add Order for Customer",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormAddOrderForCustomer",
      },
    ];
    dispatch(setComponentsAction(Component));
  }, []);

  //   console.log("customerDetails", customerDetails);

  return (
    <div>
      <div className="flex justify-between mb-3">
        <div>
          Customer's Name:{" "}
          <span className="font-semibold">{customerDetails.name}</span>
        </div>
        <div>
          Facebook:{" "}
          <span className="font-semibold">{customerDetails.facebook}</span>
        </div>
        <div>
          Phone number:{" "}
          <span className="font-semibold">{customerDetails.phone}</span>
        </div>
      </div>
      <div className="mb-3">
        Address:{" "}
        <span className="font-semibold">{customerDetails.address}</span>
      </div>
      <div className="mb-3">
        Payment Infor:{" "}
        <span className="font-semibold">{customerDetails.payment_info}</span>
      </div>
      <div className="mb-3">
        Number of Orders:{" "}
        <span className="font-semibold">{orderListByCustomer?.length}</span>
      </div>
      <div>
        <div className="mb-3 flex justify-between items-end">
          <h5>
            <i className="fa fa-file-invoice"></i> Orders
          </h5>
        </div>
        <Table
          rowKey={(record) => record.id}
          loading={orderLoading}
          columns={columns}
          dataSource={orderListByCustomer}
        />
      </div>
    </div>
  );
}
