import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { connect, useSelector } from "react-redux";
import { createProcessApi } from "../../redux/reducers/ProcessReducer";

function FormAddProcess(props) {
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
            rules={[{ required: true, message: "Process name is required" }]}
            name="process_name"
            label="Process name"
          >
            <Input placeholder="Type process name" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const CreateProcessFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { productEdit } = props;
    return {
      process_name: "",
      product_id: productEdit.id,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // console.log(values);
    const data = {
      process_name: values.process_name,
      product_id: values.product_id,
    };
    // console.log(data);
    props.dispatch(createProcessApi(data));
  },
  displayName: "CreateProcessFormik",
})(FormAddProcess);

const mapStateToProps = (state) => {
  return {
    productEdit: state.ProductReducer.productEdit,
  };
};

const ConnectedAddProcessFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(CreateProcessFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedAddProcessFormik {...props} formRef={ref} />
));
