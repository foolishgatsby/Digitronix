import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { withFormik } from "formik";
import React, { useEffect, useImperativeHandle } from "react";
import { connect, useDispatch } from "react-redux";
import {
  getAllProductApi,
  getAllProductNoPaging,
} from "../../redux/reducers/ProductReducer";
import { USER_ID, USER_NAME } from "../../utils/constants/settingSystem";
import { getAllCustomersAPI } from "../../redux/reducers/CustomerReducer";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { mapProductListToOptions } from "./FormAddOrderForCustomer";
import { addOrderApi } from "../../redux/reducers/OrderReducer";

export const mapCustomerListToOption = (customerList) => {
  return customerList?.map((customer) => {
    return {
      value: customer.id,
      label: customer.name,
    };
  });
};

function FormAddOrder(props) {
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

  useEffect(() => {
    // get all customer
    dispatch(getAllCustomersAPI());
    dispatch(getAllProductNoPaging());
  }, []);

  useImperativeHandle(props.formRef, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="user_id"
            label="User ID"
            initialValue={values.user_id}
          >
            <Select
              disabled
              placeholder="User ID"
              options={[{ label: values.user_name, value: values.user_id }]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="customer_id" label="Customer's Name">
            <Select
              placeholder="Choose customer"
              options={mapCustomerListToOption(values.customerList)}
              onChange={(value) => setFieldValue("customer_id", value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select created date!",
              },
            ]}
            name="created_date"
            label="Created Date"
          >
            <DatePicker
              className="w-full"
              showTime
              onChange={(date, dateString) =>
                setFieldValue("created_date", dateString)
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select deadline!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("created_date") < value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Deadline must be after created date!");
                },
              }),
            ]}
            dependencies={["created_date"]}
            name="deadline"
            label="Deadline"
          >
            <DatePicker
              className="w-full"
              showTime
              onChange={(date, dateString) =>
                setFieldValue("deadline", dateString)
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select delivery method!",
              },
            ]}
            name="delivery_method"
            label="Delivery Method"
          >
            <Select
              placeholder="Delivery Method"
              onChange={(value) => setFieldValue("delivery_method", value)}
              options={[
                { label: "GHTK", value: "GHTK" },
                { label: "Company Vehicle", value: "Company Vehicle" },
                { label: "Transport Station", value: "Transport Station" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select payment method!",
              },
            ]}
            name="payment_method"
            label="Payment Method"
          >
            <Select
              placeholder="Payment Method"
              onChange={(value) => setFieldValue("payment_method", value)}
              options={[
                { label: "COD", value: "COD" },
                { label: "Banking", value: "Banking" },
                { label: "Debt", value: "Debt" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select status!",
              },
            ]}
            name="status"
            label="Status"
          >
            <Select
              placeholder="Status"
              onChange={(value) => setFieldValue("status", value)}
              options={[
                { label: "Pending", value: "Pending" },
                { label: "Confirmed", value: "Confirmed" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="order_detail_list"
            label="Order Detail List"
            rules={[
              {
                required: true,
                message: "Please add order detail",
              },
              {
                min: 1,
                message: "Please add at least one order detail",
              },
            ]}
          >
            <Form.List name="order_detail_list">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row
                      key={key}
                      gutter={16}
                      style={{ marginBottom: "8px", alignItems: "baseline" }}
                    >
                      <Col span={12}>
                        <Form.Item {...restField} name={[name, "product_id"]}>
                          <Select
                            placeholder="Product ID"
                            {...restField}
                            options={mapProductListToOptions(
                              values.productList
                            )}
                            onSelect={(value, option) => {
                              setFieldValue(
                                `order_detail_list[${key}].product_id`,
                                value
                              );
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item {...restField} name={[name, "quantity"]}>
                          <Input
                            placeholder="Quantity"
                            {...restField}
                            onChange={(e) => {
                              setFieldValue(
                                `order_detail_list[${key}].quantity`,
                                e.target.value
                              );
                            }}
                            onBlur={handleBlur}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const AddOrderFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { customerList, productList, userLoginInfo } = props;
    // console.log("customerList", customerList);
    return {
      user_id: localStorage.getItem(USER_ID) || userLoginInfo.id,
      user_name: localStorage.getItem(USER_NAME) || userLoginInfo.username,
      customerList: customerList,
      productList: productList,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log(values);
    props.dispatch(addOrderApi(values));
  },

  displayName: "AddOrderFormik",
})(FormAddOrder);

const mapStateToProps = (state) => {
  return {
    customerList: state.CustomerReducer.customerList,
    productList: state.ProductReducer.productList,
    userLoginInfo: state.LoginReducer.userLoginInfo,
  };
};

const ConnectedAddOrderFormik = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(AddOrderFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedAddOrderFormik {...props} formRef={ref} />
));
