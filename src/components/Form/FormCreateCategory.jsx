import { Form, Input } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { createCategoryApi } from "../../redux/reducers/CategoryReducer";

function FormCreateCategory(props) {
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
        label="Category name"
      >
        <Input placeholder="Type category name" onChange={handleChange} />
      </Form.Item>
    </Form>
  );
}

const CreateCategoryFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      name: "",
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    const data = {
      category_name: values.name,
    };
    props.dispatch(createCategoryApi(data));
  },
  displayName: "CreateCategoryFormik",
})(FormCreateCategory);

export default React.forwardRef((props, ref) => (
  <CreateCategoryFormik {...props} formRef={ref} />
));
