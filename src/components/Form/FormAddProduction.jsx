import { Col, Form, Row, DatePicker, Input, Select } from "antd";
import { withFormik } from "formik";
import React, { useEffect, useImperativeHandle } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getAllProcessApi } from "../../redux/reducers/ProcessReducer";
import { getAllOrdersAPI } from "../../redux/reducers/OrderReducer";
import { addProductionApi } from "../../redux/reducers/ProductionReducer";

const { RangePicker } = DatePicker;

function FormAddProduction(props) {
  const dispatch = useDispatch();

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  const { processList } = useSelector((state) => state.ProcessReducer);
  const { orderList } = useSelector((state) => state.OrderReducer);

  useEffect(() => {
    dispatch(getAllProcessApi());
    dispatch(getAllOrdersAPI());
  }, []);

  useImperativeHandle(props.formRef, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Process ID is required" }]}
            name="process_id"
            label="Process ID"
          >
            <Select
              placeholder={"Pick a process to start production"}
              onChange={(value) => {
                setFieldValue("process_id", value);
              }}
            >
              {processList?.map((process, index) => (
                <Select.Option key={index} value={process.id}>
                  {process.process_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Order ID is required" }]}
            name="order_id"
            label="Order ID"
          >
            <Select
              placeholder="Choose order"
              onChange={(value) => {
                setFieldValue("order_id", value);
              }}
            >
              {orderList?.map((order, index) => (
                <Select.Option key={index} value={order.id}>
                  Order ID {order.id} - Customer: {order.customer_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Choose start and end date"
            rules={[{ required: true, message: "Choose start and end date" }]}
          >
            <RangePicker
              showTime={{
                format: "HH:mm:ss",
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(value, dateString) => {
                console.log(value);
                setFieldValue("time_start", dateString[0]);
                setFieldValue("time_end", dateString[1]);
              }}
            //   onOk={(value) => console.log("onOk: ", value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              { required: true, message: "Quantity is required" },
              { regex: /^[0-9]*$/, message: "Quantity must be a number" },
            ]}
            name="quantity"
            label="Quantity"
          >
            <Input
              type="number"
              placeholder="Type quantity"
              onChange={handleChange}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const AddProductionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { userLoginInfo } = props;
    return {
      // Add props here
      process_id: 0,
      order_id: 0,
      time_start: "",
      time_end: "",
      quantity: 0,
      status: "todo",
      user_id: localStorage.getItem("user_id") || userLoginInfo.id,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // Add submit function here
    console.log(values);
    props.dispatch(addProductionApi(values));
  },
  displayName: "AddProductionFormik",
})(FormAddProduction);

const mapStateToProps = (state) => {
  return {
    userLoginInfo: state.UserReducer.userLoginInfo,
  };
};

const ConnectedAddProductionFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(AddProductionFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedAddProductionFormik {...props} formRef={ref} />
));
