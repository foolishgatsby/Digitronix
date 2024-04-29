import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { connect } from "react-redux";
import { updateCustomerAPI } from "../../redux/reducers/CustomerReducer";

function FormEditCustomerInformation(props) {
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
          <Form.Item name="id" label="Customer Id" initialValue={values.id}>
            <Input disabled placeholder="ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="name"
            label="Customer Name"
            initialValue={values.name}
          >
            <Input
              placeholder="Customer Name"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            initialValue={values.address}
          >
            <Input
              placeholder="Address"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="phone" label="Phone" initialValue={values.phone}>
            <Input
              placeholder="Phone"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="facebook"
            label="Facebook"
            initialValue={values.facebook}
          >
            <Input
              placeholder="Facebook"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="payment_info"
            label="Payment Information"
            initialValue={values.payment_info}
          >
            <Input
              placeholder="Payment Information"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const EditCustomerInformationFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { customerDetails } = props;
    return {
      id: customerDetails.id,
      name: customerDetails.name,
      phone: customerDetails.phone,
      address: customerDetails.address,
      facebook: customerDetails.facebook,
      payment_info: customerDetails.payment_info,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // console.log(values);
    const data = {
      id: values.id,
      name: values.name,
      phone: values.phone,
      address: values.address,
      facebook: values.facebook,
      payment_info: values.payment_info,
    };
    props.dispatch(updateCustomerAPI(data));
  },
})(FormEditCustomerInformation);

const mapStateToProps = (state) => {
  return {
    customerDetails: state.CustomerReducer.customerDetails,
  };
};

const ConnectedEditCustomerInformationFormik = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(EditCustomerInformationFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedEditCustomerInformationFormik {...props} formRef={ref} />
));
