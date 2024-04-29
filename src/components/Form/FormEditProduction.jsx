import React, { useImperativeHandle } from "react";
import { withFormik } from "formik";
import { connect } from "react-redux";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { updateProductionApi } from "../../redux/reducers/ProductionReducer";

const { RangePicker } = DatePicker;

function FormEditProduction(props, ref) {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  useImperativeHandle(props.formRef, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Production ID is required",
              },
            ]}
            name="id"
            label="Production ID"
            initialValue={values.id}
          >
            <Input disabled placeholder="ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Process ID is required",
              },
            ]}
            name="process_id"
            label="Process ID"
            initialValue={values.process_id}
          >
            <Input disabled placeholder="Process ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Order ID is required",
              },
            ]}
            name="order_id"
            label="Order ID"
            initialValue={values.order_id}
          >
            <Input disabled placeholder="Order ID" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Time is required",
              },
            ]}
            name="time_start"
            label="Time Start"
            initialValue={[dayjs(values.time_start), dayjs(values.time_end)]}
          >
            <RangePicker
              className="w-full"
              showTime={{
                format: "HH:mm:ss",
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(value, dateString) => {
                setFieldValue("time_start", dateString[0]);
                setFieldValue("time_end", dateString[1]);
              }}
              //   onOk={(value) => console.log("onOk: ", value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Quantity is required",
              },
              {
                pattern: /^[0-9]*$/,
                message: "Quantity is number only",
              },
            ]}
            name="quantity"
            label="Quantity"
            initialValue={values.quantity}
          >
            <Input placeholder="Quantity" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[]}
            name="status"
            label="Status"
            initialValue={values.status}
          >
            <Select onChange={(value) => setFieldValue("status", value)}>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const EditProductionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { productionEdit } = props;
    return {
      id: productionEdit.id,
      process_id: productionEdit.process_id,
      order_id: productionEdit.order_id,
      time_start: productionEdit.time_start,
      time_end: productionEdit.time_end,
      status: productionEdit.status,
      quantity: productionEdit.quantity,
      total_cost: productionEdit.total_cost,
      user_id: productionEdit.user_id,
    };
  },
  handleSubmit: (values, { props }) => {
    props.dispatch(updateProductionApi(values));
  },
  displayName: "Edit Production",
})(FormEditProduction);

const mapStateToProps = (state) => {
  return {
    productionEdit: state.ProductionReducer.productionEdit,
  };
};

const ConnectedEditProductionFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(EditProductionFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedEditProductionFormik {...props} formRef={ref} />
));
