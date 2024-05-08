import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { withFormik } from 'formik'
import React, { useImperativeHandle } from 'react'
import { connect } from 'react-redux';
import { mapProductListToOptions } from './FormAddOrderForCustomer';
import { mapCustomerListToOption } from './FormAddOrder';
import dayjs from 'dayjs';
import { updateOrderAPI } from '../../redux/reducers/OrderReducer';

function FormEditOrder(props) {

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

    useImperativeHandle(props.formRef, () => ({
        submitForm: handleSubmit,
    }));

    return (
        <Form layout="vertical" onFinish={() => {
            if (values.status === "confirmed") {
                alert("Cannot edit confirmed order!");
                return;
            }
            handleSubmit();
        }}>
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
                    <Form.Item name="customer_id" label="Customer's Name" initialValue={values.customer_id}>
                        <Select
                            disabled={values.status === "confirmed" ? true : false}
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
                        initialValue={dayjs(values.created_date)}
                    >
                        <DatePicker
                            disabled={values.status === "confirmed" ? true : false}
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
                        initialValue={dayjs(values.deadline)}
                    >
                        <DatePicker
                            disabled={values.status === "confirmed" ? true : false}
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
                        initialValue={values.delivery_method}
                    >
                        <Select
                            disabled={values.status === "confirmed" ? true : false}
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
                        initialValue={values.payment_method}
                    >
                        <Select
                            disabled={values.status === "confirmed" ? true : false}
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
                <Col span={12}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Please input total price!",
                            },
                        ]}
                        name="total_price"
                        label="Total Price"
                        initialValue={values.total_price}
                    >
                        <Input
                            disabled={values.status === "confirmed" ? true : false}
                            placeholder="Total Price"
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "Please select status!",
                            },
                        ]}
                        name="status"
                        label="Status"
                        initialValue={values.status}
                    >
                        <Select
                            disabled={values.status === "confirmed" ? true : false}
                            placeholder="Status"
                            onChange={(value) => setFieldValue("status", value)}
                            options={[
                                { label: "Pending", value: "pending" },
                                { label: "Confirmed", value: "confirmed" },
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

const EditOrderFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { orderDetails, customerList, productList } = props;
        console.log("orderDetails", orderDetails)
        return {
            // map props to form values
            id: orderDetails.id,
            user_id: orderDetails.user_id,
            user_name: orderDetails.user_name,
            customer_id: orderDetails.customer_id,
            customer_name: orderDetails.customer_name,
            customerList: customerList,
            created_date: orderDetails.created_date,
            deadline: orderDetails.deadline,
            delivery_method: orderDetails.delivery_method,
            payment_method: orderDetails.payment_method,
            total_price: orderDetails.total_price,
            status: orderDetails.status,
            order_detail_list: orderDetails.orderDetailResponses,
            productList: productList,
        }
    },
    handleSubmit: (values, { props, setSubmitting }) => {
        // handle submit form
        if (values.status === "confirmed") {
            alert("Cannot edit confirmed order!");
            return;
        }
        props.dispatch(updateOrderAPI(values));
    },
    displayName: "EditOrderFormik",
})(FormEditOrder);

const mapStateToProps = (state) => {
    return {
        // map state to props
        orderDetails: state.OrderReducer.orderDetails,
        customerList: state.CustomerReducer.customerList,
        productList: state.ProductReducer.productList,
    }
}

const ConnectedEditOrderFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(EditOrderFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedEditOrderFormik {...props} formRef={ref} />
));


