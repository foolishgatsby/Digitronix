import { Col, Input, Row, Select, Form } from "antd";
import { withFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoryMaterialApi } from "../../redux/reducers/CategoryReducer";
import { setSubmitFunc } from "../../redux/reducers/ModalReducer";
import { createMaterialApi } from "../../redux/reducers/MaterialReducer";

const { Option } = Select;

function FormCreateMaterial(props) {
  const { categoryMaterialList } = useSelector(
    (state) => state.CategoryReducer
  );

  const {
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategoryMaterialApi());
    // dispatch(setSubmitFunc(handleSubmit));
  }, []);

  useImperativeHandle(props.formRef, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Material name is required" }]}
            name="material_name"
            label="Material Name"
          >
            <Input placeholder="Type material name" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              { required: true, message: "Material price is required" },
              {
                pattern: new RegExp(/^\d+(\.\d+)?$/),
                message: "Price must be a number",
              },
              {
                validator(_, value) {
                  if (!value || value >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The price must be greater than 0")
                  );
                },
              },
            ]}
            name="price"
            label="Material Price"
          >
            <Input placeholder="Type material price" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            rules={[
              { required: true, message: "Material category is required" },
            ]}
            name="category_id"
            label="Material Category"
          >
            <Select
              placeholder="Select category"
              onChange={(value) => setFieldValue("category_id", value)}
            >
              {categoryMaterialList?.map((category, index) => (
                <Option key={index} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              { required: true, message: "Material quantity is required" },
              {
                pattern: new RegExp(/^\d+$/),
                message: "Quantity must be a number",
              },
              {
                validator(_, value) {
                  if (!value || value >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The quantity must be greater than 0")
                  );
                },
              },
            ]}
            name="quantity"
            label="Material Quantity"
          >
            <Input
              placeholder="Type material quantity"
              onChange={handleChange}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const CreateMaterialFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    material_name: "",
    price: 0,
    category_id: "",
    quantity: 0,
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const newMaterial = {
      material_name: values.material_name,
      price: values.price,
      category_id: values.category_id,
      quantity: values.quantity,
    };
    console.log("newMaterial", newMaterial);
    props.dispatch(createMaterialApi(newMaterial));
  },
})(FormCreateMaterial);

export default forwardRef((props, ref) => (
  <CreateMaterialFormik {...props} formRef={ref} />
));
