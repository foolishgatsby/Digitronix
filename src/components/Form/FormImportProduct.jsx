import { Col, Form, Input, Row, Select } from "antd";
import { withFormik } from "formik";
import React, { useEffect, useImperativeHandle } from "react";
import { connect, useDispatch } from "react-redux";
import {
  editProductApi,
  getAllProductNoPaging,
} from "../../redux/reducers/ProductReducer";
import { importExportProductAPI } from "../../redux/reducers/DataAccess";

export const mapProductListToOption = (productList) => {
  return productList.map((product) => ({
    value: product.id,
    label: product.name,
    quantity: product.quantity,
  }));
};

function FormImportProduct(props) {
  const dispatch = useDispatch();

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

  useEffect(() => {
    // Get all products
    dispatch(getAllProductNoPaging());
  }, []);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[{ required: true, message: "Product is required" }]}
            name="product_id"
            label="Select Product"
          >
            <Select
              showSearch
              placeholder="Select product ID"
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={(value, option) => {
                setFieldValue("product_id", value);
                setFieldValue("product_name", option.label);
                setFieldValue("product_quantity_before", option.quantity);
              }}
              options={mapProductListToOption(values.productList)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              { required: true, message: "Product Quantity is required" },
              {
                pattern: /^[0-9]*$/,
                message: "Product Quantity must be number",
              },
            ]}
            name="product_quantity"
            label="Quantity"
          >
            <Input
              placeholder="Type product quantity"
              onChange={handleChange}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const ImportProductFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { productList } = props;
    return {
      product_id: "",
      product_name: "",
      product_quantity: "",
      access_status: 1,
      productList: productList,
      product_quantity_before: 0,
    };
  },
  handleSubmit: (values, { props }) => {
    console.log(values);
    // call API for import product
    props.dispatch(importExportProductAPI(values));
    const editProduct = {
      id: values.product_id,
      product_name: values.product_name,
      quantity:
        Number(values.product_quantity) +
        Number(values.product_quantity_before),
    };
    props.dispatch(editProductApi(editProduct));
  },
})(FormImportProduct);

const mapStateToProps = (state) => {
  return {
    productList: state.ProductReducer.productList,
  };
};

const ConnectedImportProductFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(ImportProductFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedImportProductFormik {...props} formRef={ref} />
));
