import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { connect } from "react-redux";
import { updateCategoryApi } from "../../redux/reducers/CategoryReducer";

function FormEditCategory(props) {
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
          <Form.Item name="id" label="Category Id" initialValue={values.id}>
            <Input disabled placeholder="ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="category_name"
            label="Category name"
            initialValue={values.name}
          >
            <Input
              placeholder="Category Name"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const EditCategoryFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editCategory } = props;
    console.log(editCategory);
    return {
      id: editCategory.id,
      name: editCategory.name,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    const category = {
      category_name: values.category_name,
      id: values.id,
    };
    props.dispatch(updateCategoryApi(category));
  },
  displayName: "EditCategoryFormik",
})(FormEditCategory);

const mapStateToProps = (state) => {
  return {
    editCategory: state.CategoryReducer.editCategory,
  };
};

const ConnectedEditCategoryFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(EditCategoryFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedEditCategoryFormik {...props} formRef={ref} />
));
