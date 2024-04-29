import { FloatButton, Space, Table, Tag } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import {
  getAllUserApi,
  setAccountEdit,
  setActiveUserApi,
} from "../../../redux/reducers/UserReducer";
import { getAllRoleApi } from "../../../redux/reducers/RoleReducer";

export default function AccountAdmin(props) {
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "25%",
      render: (text) => <p className="m-0">{text}</p>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "25%",
      render: (_, { role }) => <p className="m-0">{role.name}</p>,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: "25%",
      render: (_, { active }) =>
        active ? (
          <p className="m-0">Is active</p>
        ) : (
          <p className="m-0">Non Active</p>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: "25%",
      // render: (_, record) => console.log(record),
      render: (_, record) => (
        <Space size="middle">
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch(setAccountEdit(record));
              const action = {
                type: "ModalReducer/setModalOpen",
                title: "Edit Account",
                contentComponentType: "FormEditAccount",
              };
              dispatch(action);
            }}
          >
            <i className="fa fa-edit" /> Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              dispatch(setActiveUserApi(record.id, 0, record.role_id));
            }}
          >
            <i className="fa fa-times-circle" /> Deactivate
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              dispatch(setActiveUserApi(record.id, 1, record.role_id));
            }}
          >
            <i className="fa fa-check-circle" /> Active
          </button>
        </Space>
      ),
    },
  ];

  const { userList, loading } = useSelector((state) => state.UserReducer);

  useEffect(() => {
    // let Component = (
    //   <FloatButton
    //     icon={<i className="fa-solid fa-plus" />}
    //     tooltip={<div>Create new account</div>}
    //   />
    // );

    let Components = [
      {
        tooltip: "Employee Salary",
        icon: `<i className="fa fa-dollar-sign" />`,
        contentComponentType: "CategoryManagement",
        navigateTo: "/admin/accounts/salary",
      },
      {
        tooltip: "Create new account",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormCreateAccount",
      },
    ];

    dispatch(setComponentsAction(Components));
    dispatch(getAllUserApi());
    dispatch(getAllRoleApi());
  }, []);

  return (
    <div>
      <div className="mb-3 flex justify-between items-end">
        <h5>
          <i className="fas fa-user-alt" /> Accounts
        </h5>
      </div>
      <Table
        rowKey={(record) => record.id}
        loading={loading}
        columns={columns}
        dataSource={userList.filter((user) => user.role.id !== 1)}
      />
    </div>
  );
}
