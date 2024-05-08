import React, { useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch } from 'react-redux'
import { editMaterialApi, getAllMaterialNoPaging } from '../../redux/reducers/MaterialReducer';
import { withFormik } from 'formik';
import { Col, Form, Input, Row, Select, Tag } from 'antd';
import { importExportMaterialAPI } from '../../redux/reducers/DataAccess';

function FormExportMaterial(props) {

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
        // Get all materials
        dispatch(getAllMaterialNoPaging());
    }, [])

    const filterOption = (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
        <Form layout='vertical' onFinish={handleSubmit}>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        rules={[{ required: true, message: "Material is required" }]}
                        name='material_id'
                        label='Select Material'
                    >
                        <Select
                            showSearch
                            placeholder='Select material ID'
                            optionFilterProp='label'
                            filterOption={filterOption}
                            onChange={(value, option) => {
                                setFieldValue('material_id', value);
                                setFieldValue('material_name', option.label);
                                setFieldValue('material_quantity_before', option.quantity);
                            }}
                            options={values.materialList?.map((material, index) => {
                                return {
                                    value: material.id,
                                    label: material.name,
                                    tags: material.tags,
                                    category_name: material.category_name,
                                    quantity: material.quantity,
                                }
                            }
                            )}
                            optionRender={(option) => {
                                return (
                                    <div>
                                        <span>{option.data.label}</span>
                                        <span> - </span>
                                        <span>{option.data.category_name}</span>
                                        <div>
                                            {option.data.tags?.map((tag, index) => (
                                                <Tag key={index} className='tag'>{tag.name}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        rules={[
                            { required: true, message: "Material Quantity is required" },
                            {
                                pattern: /^[0-9]*$/,
                                message: "Material Quantity must be number",
                            },
                        ]}
                        name='material_quantity'
                        label='Quantity'
                    >
                        <Input
                            placeholder='Type material quantity'
                            onChange={handleChange}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

const ExportMaterialFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { materialList } = props;
        // console.log('materialList', materialList);
        return {
            material_id: "",
            material_name: "",
            material_quantity: "",
            access_status: 0,
            materialList: materialList,
            material_quantity_before: "",
        };
    },
    handleSubmit: (values, { props }) => {
        props.dispatch(importExportMaterialAPI(values));
        const editMaterial = {
            id: values.material_id,
            material_name: values.material_name,
            quantity:
                Number(values.material_quantity_before) -
                Number(values.material_quantity),
        }
        props.dispatch(editMaterialApi(editMaterial));
    },
    displayName: "ExportMaterialForm",
})(FormExportMaterial);

const mapStateToProps = (state) => {
    return {
        materialList: state.MaterialReducer.materialList,
    };
}

const ConnectedExportMaterialFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(ExportMaterialFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedExportMaterialFormik {...props} formRef={ref} />
));
