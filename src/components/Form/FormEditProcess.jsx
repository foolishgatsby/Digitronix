import { Col, Form, Input, Row } from 'antd';
import { withFormik } from 'formik';
import React, { useImperativeHandle } from 'react'
import { connect } from 'react-redux';
import { updateProcessApi } from '../../redux/reducers/ProcessReducer';

function FormEditProcess(props) {

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
        <Form layout='vertical' onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        rules={[{ required: true, message: "Process name is required" }]}
                        name='process_name'
                        label='Process name'
                        initialValue={values.process_name}
                    >
                        <Input placeholder='Type process name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

const EditProcessFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { processEdit } = props;
        return {
            id: processEdit.id,
            process_name: processEdit.process_name,
            product_id: processEdit.product_id,
        };
    },
    handleSubmit: (values, { props, setSubmitting }) => {
        const data = {
            id: values.id,
            process_name: values.process_name,
            product_id: values.product_id,
        };
        // console.log(data);
        props.dispatch(updateProcessApi(data));
    },
    displayName: "EditProcessFormik",
})(FormEditProcess);


const mapStateToProps = (state) => {
    return {
        processEdit: state.ProcessReducer.processEdit,
    };
}

const ConnectedEditProcessFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(EditProcessFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedEditProcessFormik {...props} formRef={ref} />
));
