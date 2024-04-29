import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { createCustomerAPI } from "../../redux/reducers/CustomerReducer";

function FormAddCustomer(props) {
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
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Customer's Name is required" }]}
            name="name"
            label="Customer's Name"
          >
            <Input placeholder="Type customer's name" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Address is required" }]}
            name="address"
            label="Address"
          >
            <Input placeholder="Type address" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              { required: true, message: "Phone number is required" },
              {
                pattern: /^0[0-9]{9}$/,
                message: "Phone number is invalid",
              },
            ]}
            name="phone"
            label="Phone number"
          >
            <Input placeholder="Type phone number" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="facebook" label="Facebook">
            <Input placeholder="Type facebook" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Payment infor is required" }]}
            name="payment_info"
            label="Payment Infor"
          >
            <Input placeholder="Type payment infor" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const CreateCustomerFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      name: "",
      address: "",
      phone: "",
      facebook: "",
      payment_info: "",
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    const data = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      facebook: values.facebook,
      payment_info: values.payment_info,
    };
    // console.log(data);
    props.dispatch(createCustomerAPI(data));
  },
  displayName: "CreateProcessFormik",
})(FormAddCustomer);

export default React.forwardRef((props, ref) => (
  <CreateCustomerFormik {...props} formRef={ref} />
));
