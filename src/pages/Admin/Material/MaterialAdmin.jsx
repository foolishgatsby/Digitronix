import { Button, Input, Select, Space, Table, Tag, Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  deleteMaterialApi,
  getAllMaterialNoPaging,
  getAllMetarialApi,
} from "../../../redux/reducers/MaterialReducer";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { getAllTagsApi } from "../../../redux/reducers/TagsReducer";
import { getAllCategoryMaterialApi } from "../../../redux/reducers/CategoryReducer";
import { mapTagListToOption } from "../Product/ProductAdmin";
import { NavLink } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { render } from "@testing-library/react";

export default function MaterialAdmin(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { materialList, page, limit, totalPage, loading } = useSelector(
    (state) => state.MaterialReducer
  );

  // categoryMaterialList: list of material category
  const { categoryMaterialList } = useSelector(
    (state) => state.CategoryReducer
  );
  // tagList: list of tags
  const { tagList } = useSelector((state) => state.TagsReducer);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const fetchMaterialData = () => {
    dispatch(getAllMaterialNoPaging());
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, selectedKeys, dataIndex) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search by ${dataIndex.split("_").join(" ")}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            htmlType="button"
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              backgroundColor: "#1890ff",
            }}
          >
            Search
          </Button>
          <Button
            htmlType="button"
            onClick={() => {
              // confirm();
              clearFilters && handleReset(clearFilters, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            htmlType="button"
            type="link"
            size="small"
            onClick={() => {
              confirm();
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            htmlType="button"
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      if (dataIndex !== "name") {
        return searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        );
      } else {
        return searchedColumn === dataIndex ? (
          <NavLink
            style={{
              color: "black",
              textDecoration: "none",
            }}
            to={`${record.id}`}
          >
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          </NavLink>
        ) : (
          <NavLink
            style={{
              color: "black",
              textDecoration: "none",
            }}
            to={`${record.id}`}
          >
            {text}
          </NavLink>
        );
      }
    },
  });

  const columns = [
    {
      title: "Material Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, { category_id }) => {
        const renderCategory = categoryMaterialList?.find(
          (category) => category.id === category_id
        );
        return renderCategory ? renderCategory.name : "";
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      filters: mapTagListToOption(tagList),
      onFilter: (value, record) => {
        console.log("value", value);
        console.log("record", record);
        return record.tags.map((tag) => tag.id).includes(value);
        // write return to get the tags that have the same id with the value
      },
      filterSearch: true,
      render: (_, { tags }) => (
        <>
          {tags.length !== 0 ? (
            tags.map((tag, index) => {
              return (
                <Tag color={"blue"} key={index}>
                  {tag.name.toUpperCase()}
                </Tag>
              );
            })
          ) : (
            <p className="m-0">This product dont have any tags</p>
          )}
        </>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text) => (
        <p style={{ margin: 0 }}>{text.toLocaleString()} VND</p>
      ),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <div>
            <Popconfirm
              onConfirm={() => {
                console.log("delete", record);
                dispatch(deleteMaterialApi(record.id));
              }}
              title="Are you sure you want to delete this material?"
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
  const importData = [
    {
      key: "1",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 4000,
    },
    {
      key: "2",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 2",
      quantity: 12,
    },
    {
      key: "3",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 3",
      quantity: 120,
    },
    {
      key: "4",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 120,
    },
    {
      key: "5",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 200,
    },
    {
      key: "6",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 2",
      quantity: 200,
    },
  ];
  const exportData = [
    {
      key: "1",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 4000,
    },
    {
      key: "2",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 2",
      quantity: 12,
    },
    {
      key: "3",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 3",
      quantity: 120,
    },
    {
      key: "4",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 120,
    },
    {
      key: "5",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 1",
      quantity: 200,
    },
    {
      key: "6",
      time: "12 THG 3, 2024 9:20:21 AM",
      productName: "Product 2",
      quantity: 200,
    },
  ];
  const importExportColumns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text, record, index) => <p>{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  // sử dụng useEffect để set các component action khi component được render
  useEffect(() => {
    // cài đặt các chức năng cho float button
    let Components = [
      {
        tooltip: "Import material",
        icon: `<i className="fa-solid fa-right-to-bracket" />`,
        contentComponentType: "FormImportMaterial",
      },
      {
        tooltip: "Export material",
        icon: `<i className="fa-solid fa-right-from-bracket" />`,
        contentComponentType: "FormExportMaterial",
      },
      {
        tooltip: "Create new material",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormCreateMaterial",
      },
      {
        tooltip: "Material Category Management",
        icon: `<i className="fa-solid fa-list" />`,
        contentComponentType: "MaterialCategoryManagement",
        navigateTo: "/admin/warehouse/material-categories",
      },
      {
        tooltip: "Tag Management",
        icon: `<i className="fa-solid fa-book" />`,
        contentComponentType: "TagManagement",
        navigateTo: "/admin/warehouse/tags",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryMaterialApi());
    dispatch(getAllTagsApi());
    fetchMaterialData();
  }, []);

  return (
    <div>
      <div>
        <h5>
          <i className="fas fa-list" /> Metarial List
        </h5>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={materialList}
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="col-span-1">
          <h5>
            <i className="fas fa-history" /> Import history
          </h5>
          <Table columns={importExportColumns} dataSource={importData} />
        </div>
        <div className="col-span-1">
          <h5>
            <i className="fas fa-history" /> Export history
          </h5>
          <Table columns={importExportColumns} dataSource={exportData} />
        </div>
      </div>
    </div>
  );
}
