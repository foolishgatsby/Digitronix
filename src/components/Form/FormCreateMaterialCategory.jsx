import { Form, Input } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { createCategoryMaterialApi } from "../../redux/reducers/CategoryReducer";

function FormCreateMaterialCategory(props) {
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
      <Form.Item
        rules={[{ required: true, message: "Category name is required" }]}
        name="name"
        label="Material Category name"
      >
        <Input placeholder="Type category name" onChange={handleChange} />
      </Form.Item>
    </Form>
  );
}

const CreateMaterialCategoryFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      name: "",
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    const data = {
      material_category_name: values.name,
    };
    props.dispatch(createCategoryMaterialApi(data));
  },
  displayName: "CreateMaterialCategoryFormik",
})(FormCreateMaterialCategory);

export default React.forwardRef((props, ref) => (
  <CreateMaterialCategoryFormik {...props} formRef={ref} />
));
