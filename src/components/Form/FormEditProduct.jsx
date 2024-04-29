import React from "react";
import { Col, Form, Input, Row, Select } from "antd";
import { withFormik } from "formik";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSubmitFunc } from "../../redux/reducers/ModalReducer";
import { connect } from "react-redux";
import { getAllCategoryApi } from "../../redux/reducers/CategoryReducer";
import { getAllTagsApi } from "../../redux/reducers/TagsReducer";
import { editProductApi } from "../../redux/reducers/ProductReducer";

const { Option } = Select;

export const mapTagListToOptions = (tagList) => {
  return tagList.map((tag) => {
    return { label: tag.name, value: tag.id };
  });
};

function FormEditProduct(props) {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  const { categoryList } = useSelector((state) => state.CategoryReducer);
  const { tagList } = useSelector((state) => state.TagsReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSubmitFunc(handleSubmit));
    dispatch(getAllCategoryApi());
    dispatch(getAllTagsApi());
  }, []);

  useImperativeHandle(props.formRef, () => ({
    submitForm: handleSubmit,
  }));

  const assignTagsToProduct = (e) => {
    console.log(e);
    setFieldValue(
      "tags",
      e.map((tag) => tag)
    );
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="id" label="Product Id" initialValue={values.id}>
            <Input disabled placeholder="ID" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="product_name"
            label="Product Name"
            initialValue={values.product_name}
          >
            <Input placeholder="Product Name" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="price" label="Price" initialValue={values.price}>
            <Input placeholder="Price" onChange={handleChange} />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="category_id"
            label="Category"
            initialValue={values.category_id}
          >
            <Select
              onChange={(value) => {
                setFieldValue("category_id", value);
              }}
            >
              {categoryList.map((category, index) => {
                return (
                  <Option key={index} value={category.id}>
                    {category.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="tags" label="Tags" initialValue={values.tags}>
            <Select
              mode="tags"
              options={mapTagListToOptions(tagList)}
              onChange={assignTagsToProduct}
            />
          </Form.Item>
          <button
            type="button"
            className="btn border-0 btn-sm"
            onClick={(e) => {
              e.preventDefault();
              console.log(values.tags);
            }}
          >
            Assign Tags
          </button>
        </Col>
      </Row>
    </Form>
  );
}

const EditProductFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { productEdit } = props;
    console.log(productEdit);
    console.log(mapTagListToOptions(productEdit.tags));
    return {
      id: productEdit.id,
      product_name: productEdit.name,
      price: productEdit.price,
      category_id: productEdit.category_id,
      category_name: productEdit.category_name,
      quantity: productEdit.quantity,
      tags: mapTagListToOptions(productEdit.tags),
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // nhấn submit form => dispatch edit account
    console.log(values);

    const editProduct = {
      id: values.id,
      product_name: values.product_name,
      price: values.price,
      category_id: values.category_id,
      quantity: values.quantity,
    };

    // call api edit product
    props.dispatch(editProductApi(editProduct));

    // props.dispatch(updateUserApi(values.id, values.role_id));
  },
  displayName: "EditProductFormik",
})(FormEditProduct);

const mapStateToProps = (state) => {
  return {
    productEdit: state.ProductReducer.productEdit,
  };
};

export default connect(mapStateToProps)(
  forwardRef((props, ref) => <EditProductFormik {...props} formRef={ref} />)
);
