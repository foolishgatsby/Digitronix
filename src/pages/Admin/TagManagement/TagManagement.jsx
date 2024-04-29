import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAllTagsApi, setEditTag } from "../../../redux/reducers/TagsReducer";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { Popconfirm, Table } from "antd";
import { deleteCategoryApi } from "../../../redux/reducers/CategoryReducer";

export default function TagManagement(props) {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Tag Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
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
                dispatch(setEditTag(record));
                const action = {
                  type: "ModalReducer/setModalOpen",
                  title: "Edit Tag",
                  contentComponentType: "FormEditTag",
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

  const { tagList } = useSelector((state) => state.TagsReducer);

  useEffect(() => {
    const Components = [
      {
        icon: `<i className="fas fa-plus" />`,
        tooltip: "Add New Tag",
        contentComponentType: "FormAddTag",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllTagsApi());
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h5>
          <i className="fas fa-list" /> Tag List
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
        dataSource={tagList}
      />
    </div>
  );
}
