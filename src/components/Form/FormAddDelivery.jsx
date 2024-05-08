import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { withFormik } from 'formik';
import React, { useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch } from 'react-redux'
import { addDeliveryAPI } from '../../redux/reducers/DeliveriesReducer';

function FormAddDelivery(props) {

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

    }, [])

    useImperativeHandle(props.formRef, () => ({
        submitForm: handleSubmit,
    }));

    return (
        <Form layout='vertical' onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item rules={[
                        { required: true, message: 'Order ID is required' },
                    ]} name='order_id' label='Order ID'>
                        <Select
                            placeholder='Select Order'
                            onChange={(value) => {
                                setFieldValue('order_id', value);
                            }}>
                            {values.orderList.filter((order) => order.status === "produced").map((order, index) => {
                                return <Select.Option key={index} value={order.id}>Order ID: {order.id} - Customer Name: {order.customer_name} - Customer Address: {order.customerAddress}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        rules={[{ required: true, message: 'Delivery Date is required' }]}
                        name='delivery_date' label='Delivery Date'>
                        <DatePicker showTime className='w-full' onChange={(date, dateString) => setFieldValue('delivery_date', dateString)} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

const AddDeliveryFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => ({
        delivery_date: '',
        status: 0,
        order_id: '',
        orderList: props.orderList,
    }),
    handleSubmit: (values, { props }) => {
        // console.log(values);
        props.dispatch(addDeliveryAPI(values));
    },
    displayName: 'FormAddDelivery',
})(FormAddDelivery);

const mapStateToProps = (state) => {
    return {
        orderList: state.OrderReducer.orderList,
    }
}

const ConnectedAddDeliveryFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(AddDeliveryFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedAddDeliveryFormik {...props} formRef={ref} />
));


