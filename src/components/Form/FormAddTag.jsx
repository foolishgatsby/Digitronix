import { Form, Input } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { createTagsApi } from "../../redux/reducers/TagsReducer";

function FormAddTag(props) {
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
        rules={[{ required: true, message: "Tag name is required" }]}
        name="tag_name"
        label="Tag name"
      >
        <Input placeholder="Type tag name" onChange={handleChange} />
      </Form.Item>
    </Form>
  );
}

const CreateTagFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    return {
      tag_name: "",
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // console.log(values);
    const data = {
      tag_name: values.tag_name,
    };
    props.dispatch(createTagsApi(data));
  },
  displayName: "CreateTagFormik",
})(FormAddTag);

export default React.forwardRef((props, ref) => (
  <CreateTagFormik {...props} formRef={ref} />
));
