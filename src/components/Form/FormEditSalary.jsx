import { withFormik } from 'formik'
import React, { useImperativeHandle } from 'react'
import { updateSalaryAPI } from '../../redux/reducers/SalaryReducer';
import { connect } from 'react-redux';
import { Col, Form, Input, Row } from 'antd';

function FormEditSalary(props) {

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
                <Col span={8}>
                    <Form.Item name='user_id' label='User Id' initialValue={values.user_id}>
                        <Input disabled placeholder='User Id' onChange={handleChange} />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item name='user_name' label='User Name' initialValue={values.user_name}>
                        <Input disabled placeholder='User Name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        rules={[
                            { required: true, message: 'Please input Salary per date' },
                            {
                                pattern: /^[0-9]*$/,
                                message: 'Salary must be number!'
                            }
                        ]}
                        name='salary_per_date' label='Salary' initialValue={values.salary_per_date}>
                        <Input placeholder='Salary per date' onChange={handleChange} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        rules={[
                            { required: true, message: 'Please input KPI!' },
                            {
                                pattern: /^[0-9]*$/,
                                message: 'KPI must be number!'
                            }
                        ]}
                        name='min_kpi' label='KPI' initialValue={values.min_kpi}>
                        <Input placeholder='KPI' onChange={handleChange} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name='rate_sa' label='Rate Salary' initialValue={values.rate_sa}>
                        <Input disabled placeholder='Rate Salary' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

const EditSalaryFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { salaryEdit } = props;
        return {
            id: salaryEdit.id,
            user_id: salaryEdit.user_id,
            user_name: salaryEdit.user_name,
            salary_per_date: salaryEdit.salary_per_date,
            min_kpi: salaryEdit.min_kpi,
            rate_sa: salaryEdit.rate_sa,
            working_date: salaryEdit.working_date,
            total: salaryEdit.total,
        };
    },
    handleSubmit: (values, { props, setSubmitting }) => {
        // nhấn submit form => dispatch edit salary
        console.log(values);
        props.dispatch(updateSalaryAPI(values));
    },
    displayName: "EditSalaryFormik",
})(FormEditSalary);

const mapStateToProps = (state) => {
    return {
        salaryEdit: state.SalaryReducer.salaryEdit,
    };
}

const ConnectedEditSalaryFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(EditSalaryFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedEditSalaryFormik {...props} formRef={ref} />
));
