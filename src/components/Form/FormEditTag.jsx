import { Col, Form, Input, Row } from "antd";
import { withFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { connect } from "react-redux";
import { updateTagsApi } from "../../redux/reducers/TagsReducer";

function FormEditTag(props) {
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
          <Form.Item name="id" label="Tag Id" initialValue={values.id}>
            <Input disabled placeholder="ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="tag_name"
            label="Tag name"
            initialValue={values.name}
          >
            <Input
              placeholder="Tag Name"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const EditTagFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editTag } = props;
    return {
      id: editTag.id,
      name: editTag.name,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    const tag = {
      tag_name: values.tag_name,
      id: values.id,
    };
    props.dispatch(updateTagsApi(tag));
  },
})(FormEditTag);

const mapStateToProps = (state) => {
  return {
    editTag: state.TagsReducer.editTag,
  };
};

const ConnectedEditTagFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(EditTagFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedEditTagFormik {...props} formRef={ref} />
));
