import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { connect } from "react-redux";
import { updateCategoryMaterialApi } from "../../redux/reducers/CategoryReducer";

function FormEditCategoryMaterial(props) {
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
            name="material_category_name"
            label="Material Category name"
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

const EditCategoryMaterialFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editCategoryMaterial } = props;
    return {
      id: editCategoryMaterial.id,
      name: editCategoryMaterial.name,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    const category = {
      id: values.id,
      material_category_name: values.material_category_name,
    };
    props.dispatch(updateCategoryMaterialApi(category));
  },
})(FormEditCategoryMaterial);

const mapStateToProps = (state) => {
  return {
    editCategoryMaterial: state.CategoryReducer.editCategoryMaterial,
  };
};

const ConnectedEditCategoryMaterialFormik = connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  }
)(EditCategoryMaterialFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedEditCategoryMaterialFormik {...props} formRef={ref} />
));
