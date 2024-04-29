import { Popconfirm, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategoryApi,
  getAllCategoryApi,
  setEditCategory,
} from "../../../redux/reducers/CategoryReducer";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { useNavigate } from "react-router";

export default function CategoryManagement(props) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return new Date(text).toLocaleString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "15%",
      render: (text, record) => {
        return (
          <div>
            <button
              className="bg-green-500 text-white p-2 rounded-md"
              onClick={() => {
                dispatch(setEditCategory(record));
                const action = {
                  type: "ModalReducer/setModalOpen",
                  title: "Edit Category",
                  contentComponentType: "FormEditCategory",
                };
                dispatch(action);
              }}
            >
              Edit
            </button>
            <Popconfirm
              onConfirm={() => {
                // console.log("delete", record);
                dispatch(deleteCategoryApi(record.id));
              }}
              title="Are you sure you want to delete this category?"
              okButtonProps={{ type: "text" }}
              cancelButtonProps={{ type: "text" }}
            >
              <button className="bg-red-500 text-white p-2 rounded-md ms-2">
                Delete
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const dispatch = useDispatch();

  const { categoryList } = useSelector((state) => state.CategoryReducer);

  useEffect(() => {
    const Components = [
      {
        icon: `<i className='fas fa-plus' />`,
        tooltip: "Create New Category",
        contentComponentType: "FormCreateCategory",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryApi());
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h5>
          <i className="fas fa-list" /> Category List
        </h5>
        <button
          style={{
            textDecoration: "none",
          }}
          className="btn btn-link"
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          {"< BACK"}
        </button>
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={categoryList}
      />
    </div>
  );
}
