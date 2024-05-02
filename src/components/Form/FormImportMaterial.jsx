import React, { useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch } from 'react-redux';
import { editMaterialApi, getAllMaterialNoPaging } from '../../redux/reducers/MaterialReducer';
import { withFormik } from 'formik';
import { Col, Form, Input, Row, Select } from 'antd';
import { importExportMaterialAPI } from '../../redux/reducers/DataAccess';

export const mapMaterialListToOption = (materialList) => {
    return materialList.map((material) => ({
        value: material.id,
        label: material.name,
        quantity: material.quantity,
    }));
}

function FormImportMaterial(props) {

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
        dispatch(getAllMaterialNoPaging());
    }, []);

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
                            optionFilterProp='children'
                            filterOption={filterOption}
                            onChange={(value, option) => {
                                setFieldValue('material_id', value);
                                setFieldValue('material_name', option.label);
                                setFieldValue('material_quantity_before', option.quantity);
                            }}
                            options={mapMaterialListToOption(values.materialList)}
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

const ImportMaterialFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
        const { materialList } = props;
        return {
            material_id: "",
            material_name: "",
            material_quantity: "",
            access_status: 1,
            materialList: materialList,
            material_quantity_before: "",
        };
    },
    handleSubmit: (values, { props }) => {
        // console.log(values);
        props.dispatch(importExportMaterialAPI(values));
        const editMaterial = {
            id: values.material_id,
            material_name: values.material_name,
            quantity:
                Number(values.material_quantity_before) +
                Number(values.material_quantity),
        }
        props.dispatch(editMaterialApi(editMaterial));
    },
    displayName: "ImportMaterialForm",
})(FormImportMaterial);

const mapStateToProps = (state) => {
    return {
        materialList: state.MaterialReducer.materialList,
    };
}

const ConnectedImportMaterialFormik = connect(mapStateToProps, null, null, {
    forwardRef: true,
})(ImportMaterialFormik);

export default React.forwardRef((props, ref) => (
    <ConnectedImportMaterialFormik {...props} formRef={ref} />
));

