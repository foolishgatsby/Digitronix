import { Col, Form, Input, Row, Select } from "antd";
import { withFormik } from "formik";
import React, { useEffect, useImperativeHandle } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getAllProcessApi,
  getProcessById,
} from "../../redux/reducers/ProcessReducer";
import { createProductionDetailApi } from "../../redux/reducers/ProductionReducer";
import { getAllUserApi } from "../../redux/reducers/UserReducer";
import { ROLE } from "../../utils/constants/settingSystem";

export const mapProcessDetailListToOption = (processDetailList) => {
  return processDetailList?.map((processDetail) => {
    return {
      value: processDetail.id,
      label: processDetail.detail_name,
    };
  });
};

export const searchAlreadySelectedProcessDetailFromProduction = (
  production
) => {
  return production.production_detail.map((productionDetail) => {
    return productionDetail.process_detail_id; // mảng id process detail đã được chọn
  });
};

export const filterNoneSelectedProcessDetail = (
  processDetailList, // danh sách process detail từ process
  selectedProcessDetail // danh sách id process detail đã được chọn từ production
) => {
  return processDetailList?.filter((processDetail) => {
    return !selectedProcessDetail.includes(processDetail.id);
  }); // trả về danh sách process detail chưa được chọn
};

function FormAddProductionDetail(props) {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  const dispatch = useDispatch();

  const { processEdit } = useSelector((state) => state.ProcessReducer);

  useEffect(() => {
    dispatch(getAllUserApi());
    dispatch(getProcessById(values.productionEdit.process_id));
  }, []);

  useImperativeHandle(props.formRef, () => ({
    submitForm: props.handleSubmit,
  }));

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="production_id"
            label="Production ID"
            initialValue={values.productionEdit.id}
          >
            <Input
              disabled
              placeholder="Production ID"
              onChange={handleChange}
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
                message: "Production Detail Name is required",
              },
            ]}
            name="name"
            label="Production Detail Name"
          >
            <Input
              placeholder="Type production detail name"
              onChange={handleChange}
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
                message: "In Material Quantity is required",
              },
              {
                regex: /^[0-9]*$/,
                message: "In Material Quantity must be a number",
              },
            ]}
            name="in_material_quantity"
            label="In Material Quantity"
          >
            <Input
              placeholder="Type in material quantity"
              onChange={handleChange}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Out Quantity is required",
              },
              {
                regex: /^[0-9]*$/,
                message: "Out Quantity must be a number",
              },
            ]}
            name="out_quantity"
            label="Out Quantity"
          >
            <Input placeholder="Type out quantity" onChange={handleChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Process Detail is required",
              },
            ]}
            name="process_detail_id"
            label="Process Detail"
          >
            <Select
              placeholder="Select process detail"
              options={mapProcessDetailListToOption(
                filterNoneSelectedProcessDetail(
                  processEdit.process_details,
                  searchAlreadySelectedProcessDetailFromProduction(
                    values.productionEdit
                  )
                )
              )}
              onChange={(value) => setFieldValue("process_detail_id", value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="user_id" label="Select Worker">
            <Select placeholder="Select worker" onChange={(value) => {
              setFieldValue("user_id", value);
            }}>
              {values.userList.filter((user) => user.role.id === ROLE.WORKER.id).map((user) => {
                return (
                  <Select.Option key={user.id} value={user.id}>
                    {user.username}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const AddProductionDetailFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { productionEdit, userList } = props;
    return {
      name: "",
      in_material_quantity: 0,
      user_id: 0,
      process_detail_id: 0,
      production_id: productionEdit.id,
      out_quantity: 0,
      productionEdit: productionEdit,
      userList: userList,
    };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // nhấn submit form => dispatch add production detail
    console.log(values);
    props.dispatch(createProductionDetailApi(values));
  },
  displayName: "AddProductionDetailFormik",
})(FormAddProductionDetail);

const mapStateToProps = (state) => {
  return {
    productionEdit: state.ProductionReducer.productionEdit,
    userList: state.UserReducer.userList,
  };
};

const ConnectedAddProductionDetailFormik = connect(
  mapStateToProps,
  null,
  null,
  {
    forwardRef: true,
  }
)(AddProductionDetailFormik);

export default React.forwardRef((props, ref) => (
  <ConnectedAddProductionDetailFormik {...props} formRef={ref} />
));
