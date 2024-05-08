import { withFormik } from 'formik'
import React, { useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getAllMaterialNoPaging } from '../../redux/reducers/MaterialReducer';
import { getAllProductNoPaging } from '../../redux/reducers/ProductReducer';
import { Col, Form, Input, Row, Select, Tag } from 'antd';
import { addProcessDetailApi } from '../../redux/reducers/ProcessReducer';

function FormAddProcessDetail(props) {

    const dispatch = useDispatch();

    const { values, touched, errors, handleChange, handleBlur, handleSubmit, setFieldValue } = props;

    useImperativeHandle(props.formRef, () => ({
        submitForm: handleSubmit,
    }));

    const { materialList } = useSelector((state) => state.MaterialReducer);
    const { productList } = useSelector((state) => state.ProductReducer);

    const [displayOutput, setDisplayOutput] = React.useState(false);

    const type = ['product', 'material']

    const data = {
        product: productList,
        material: materialList
    }

    const [outputType, setOutputType] = React.useState(data[type[0]]);
    const [selectedOutput, setSelectedOutput] = React.useState(data[type[0]][0]);

    const handleTypeChange = (value) => {
        setOutputType(data[value]);
        setSelectedOutput(data[value][0]);
    }

    const handleOutputChange = (value) => {
        setFieldValue('out_id', value)
    }

    useEffect(() => {
        dispatch(getAllMaterialNoPaging());
        dispatch(getAllProductNoPaging());
    }, [])

    return (
        <Form layout='vertical' onFinish={handleSubmit}>
            <Row gutter={16} style={{
                display: displayOutput ? 'none' : 'block'
            }}>
                <Col span={24}>
                    <Form.Item
                        rules={
                            [{ required: true, message: "Process name is required" }]
                        }
                        name='process_name'
                        label='Process Name'
                        initialValue={values.process_name}
                    >
                        <Input disabled placeholder='Type process name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} style={{
                display: displayOutput ? 'none' : 'block'
            }}>
                <Col span={24}>
                    <Form.Item
                        rules={
                            [{ required: true, message: "Process details name is required" }]
                        }
                        name='details_name'
                        label='Prcess details name'
                        initialValue={values.process_description}
                    >
                        <Input placeholder='Type process details name' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} style={{
                display: displayOutput ? 'none' : 'block'
            }}>
                <Col span={24}>
                    <Form.Item
                        rules={
                            [{ required: true, message: "Input material is required" }]
                        }
                        name='in_material_id'
                        label='Input material'
                    >
                        <Select
                            placeholder="Choose material"
                            onChange={(value) => {
                                setFieldValue('in_material_id', value);
                            }}
                            options={materialList.map((material, index) => {
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
                                );
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} style={{
                display: displayOutput ? 'none' : 'block'
            }}>
                <Col span={24}>
                    <Form.Item
                        rules={
                            [{ required: true, message: "Intensity is required" },
                            { regex: /^[0-9]*$/, message: "Intensity must be a number" }]
                        }
                        name='intensity'
                        label='Intensity'
                    >
                        <Input placeholder='Type intensity (must be a number)' onChange={handleChange} />
                    </Form.Item>
                </Col>
            </Row>
            <div className='text-right'>
                <button style={{
                    display: displayOutput ? 'none' : 'inline',
                }} className='btn btn-link' onClick={() => {
                    setDisplayOutput(true);
                }}>Next</button>
                <button style={{
                    display: displayOutput ? 'inline' : 'none',
                }} className='btn btn-link' onClick={() => {
                    setDisplayOutput(false);
                }}>Back</button>
            </div>
            {
                displayOutput ? (
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                rules={[{ required: true, message: 'Output type is required' }]}
                                name='out_type'
                                label='Output type'
                                initialValue={type[0]}
                            >
                                <Select placeholder='Choose type' onChange={(value) => {
                                    handleTypeChange(value);
                                }}>
                                    {type.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item}>
                                                {item}
                                            </Select.Option>
                                        );
                                    }
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                rules={[{ required: true, message: 'Output is required' }]}
                                name='out_id'
                                label='Output'
                            >
                                <Select
                                    placeholder='Choose output'
                                    onChange={(value) => {
                                        handleOutputChange(value);
                                    }}
                                    options={outputType?.map((output, index) => {
                                        return {
                                            value: output.id,
                                            label: output.name,
                                            tags: output.tags,
                                            category_name: output.category_name
                                        }
                                    })}
                                    optionRender={(option) => {
                                        return (
                                            <div>
                                                <span>{option.data.label}</span>
                                                <span> - </span>
                                                <span>{option.data.category_name}</span>
                                                <div>
                                                    {option.data.tags.map((tag, index) => {
                                                        return (
                                                            <Tag key={index}>{tag.name}</Tag>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                ) : null
            }
        </Form >
    )
}

const AddProcessDetailFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { processEdit } = props;
        return {
            product_id: processEdit.product_id,
            process_name: processEdit.process_name,
            process_id: processEdit.id,
            details_name: '',
            intensity: '',
            in_material_id: '',
            out_id: '',
        }
    },
    handleSubmit: (values, { props }) => {
        // console.log(values)
        console.log(values)
        props.dispatch(addProcessDetailApi(values))
    },
    displayName: 'AddProcessDetailForm',
})(FormAddProcessDetail)

const mapStateToProps = (state) => {
    return {
        processEdit: state.ProcessReducer.processEdit,
    }
}

const ConnectedAddProcessDetailFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(AddProcessDetailFormik)

export default React.forwardRef((props, ref) => (
    <ConnectedAddProcessDetailFormik {...props} formRef={ref} />
))