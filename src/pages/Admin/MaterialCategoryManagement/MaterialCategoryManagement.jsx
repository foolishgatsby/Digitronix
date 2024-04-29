import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategoryMaterialApi,
  getAllCategoryMaterialApi,
  setEditCategoryMaterial,
} from "../../../redux/reducers/CategoryReducer";
import { Popconfirm, Table } from "antd";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";

export default function MaterialCategoryManagement(props) {
  const dispatch = useDispatch();

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
                // console.log("edit", record);
                dispatch(setEditCategoryMaterial(record));
                const action = {
                  type: "ModalReducer/setModalOpen",
                  title: "Edit Category",
                  contentComponentType: "FormEditCategoryMaterial",
                };
                dispatch(action);
              }}
            >
              Edit
            </button>
            <Popconfirm
              onConfirm={() => {
                // console.log("delete", record);\
                dispatch(deleteCategoryMaterialApi(record.id));
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

  const { categoryMaterialList } = useSelector(
    (state) => state.CategoryReducer
  );

  useEffect(() => {
    const Components = [
      {
        icon: `<i className='fas fa-plus' />`,
        tooltip: "Create New Material Category",
        contentComponentType: "FormCreateMaterialCategory",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryMaterialApi());
  }, []);

  return (
    <div>
      <h5>
        <i className="fas fa-list" /> Material Category List
      </h5>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={categoryMaterialList}
      />
    </div>
  );
}
