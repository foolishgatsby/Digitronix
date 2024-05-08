import { Col, Form, Input, Row, Select, Tag } from 'antd';
import { withFormik } from 'formik'
import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch } from 'react-redux';
import { getAllMaterialNoPaging } from '../../redux/reducers/MaterialReducer';
import { getAllProductNoPaging } from '../../redux/reducers/ProductReducer';
import { updateProcessDetailApi } from '../../redux/reducers/ProcessReducer';

function FormEditProcessDetail(props) {

    const dispatch = useDispatch();

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

    useImperativeHandle(props.formRef, () => ({
        submitForm: handleSubmit,
    }));

    useEffect(() => {
        dispatch(getAllMaterialNoPaging());
        dispatch(getAllProductNoPaging());
    }, [])

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
                        <Input disabled placeholder='Type process name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        rules={[{ required: true, message: "Intensity is required" }]}
                        name='intensity'
                        label='Intensity'
                        initialValue={values.intensity}
                    >
                        <Input disabled placeholder='Type intensity' onChange={handleChange} />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item
                        rules={[{ required: true, message: "Detail name is required" }]}
                        name='details_name'
                        label='Detail name'
                        initialValue={values.details_name}
                    >
                        <Input placeholder='Type detail name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        rules={[{ required: true, message: "Material name is required" }]}
                        name='in_material_id'
                        label='Input material'
                        initialValue={values.in_material_id}
                    >
                        <Select
                            placeholder='Choose material'
                            onChange={(value) => setFieldValue('in_material_id', value)}
                            options={values.materialList.map((material) => {
                                return {
                                    value: material.id,
                                    label: material.name,
                                    tags: material.tags
                                }
                            })}
                            optionRender={(option) => {
                                return (
                                    <div>
                                        <span>{option.data.label}</span>
                                        <div>
                                            {option.data.tags.map((tag, index) => {
                                                return (
                                                    <Tag key={index}>{tag.name}</Tag>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {!values.is_final ? (
                    <Col span={24}>
                        <Form.Item
                            rules={[{ required: true, message: "Output material is required" }]}
                            name='out_id'
                            label='Output material'
                            initialValue={values.out_id}
                        >
                            <Select
                                placeholder='Choose material'
                                onChange={(value) => setFieldValue('out_id', value)}
                                options={values.materialList.map((material) => {
                                    return {
                                        value: material.id,
                                        label: material.name,
                                        tags: material.tags
                                    }
                                })}
                                optionRender={(option) => {
                                    return (
                                        <div>
                                            <span>{option.data.label}</span>
                                            <div>
                                                {option.data.tags.map((tag, index) => {
                                                    return (
                                                        <Tag key={index}>{tag.name}</Tag>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Col>
                ) : (
                    <Col span={24}>
                        <Form.Item
                            rules={[{ required: true, message: "Output product is required" }]}
                            name='out_id'
                            label='Output product'
                            initialValue={values.out_id}
                        >
                            <Select
                                placeholder='Choose product'
                                onChange={(value) => setFieldValue('out_id', value)}
                                options={values.productList.map((product) => {
                                    return {
                                        value: product.id,
                                        label: product.name,
                                        tags: product.tags,
                                        category_name: product.category_name
                                    }
                                })}
                                optionRender={(option) => {
                                    return (
                                        <div>
                                            <span>{option.data.label}</span>
                                            <div>
                                                {option.data.tags.map((tag, index) => {
                                                    return (
                                                        <Tag key={index}>{tag.name}</Tag>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Col>
                )
                }
            </Row>
        </Form>
    )
}

const EditProcessDetailFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { productEdit, processDetailEdit, productList, materialList } = props;
        // console.log(processDetailEdit);
        return {
            id: processDetailEdit.id,
            intensity: processDetailEdit.intensity,
            created_at: processDetailEdit.created_at,
            updated_at: processDetailEdit.updated_at,
            details_name: processDetailEdit.detail_name,
            process_id: processDetailEdit.process_id,
            is_final: processDetailEdit.is_final,
            in_material_id: processDetailEdit.in_material_id,
            material_name: processDetailEdit.material_name,
            out_id: processDetailEdit.out_id,
            process_name: processDetailEdit.process_name,
            productList: productList,
            materialList: materialList,
            product_id: productEdit.id,
        };
    },
    handleSubmit: (values, { props, setSubmitting }) => {
        // console.log(values);
        props.dispatch(updateProcessDetailApi(values));
    },
})(FormEditProcessDetail);

const mapStateToProps = (state) => {
    return {
        processDetailEdit: state.ProcessReducer.processDetailEdit,
        productList: state.ProductReducer.productList,
        materialList: state.MaterialReducer.materialList,
        productEdit: state.ProductReducer.productEdit,
    };
}

const ConnectedEditProcessDetailFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(EditProcessDetailFormik);

export default forwardRef((props, ref) => (
    <ConnectedEditProcessDetailFormik {...props} formRef={ref} />
));
