import { Button, Input, Select, Space, Table, Tag, Popconfirm } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductApi,
  getAllProductApi,
  getAllProductNoPaging,
  setLimit,
  setProductEdit,
} from "../../../redux/reducers/ProductReducer";
import { getAllCategoryApi } from "../../../redux/reducers/CategoryReducer";
import { getAllTagsApi } from "../../../redux/reducers/TagsReducer";
import { set, size } from "lodash";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { render } from "@testing-library/react";
import { getAllImportExportAPI } from "../../../redux/reducers/DataAccess";

const mapCategoryListToOption = (categoryList) => {
  return categoryList.map((category) => {
    return {
      label: category.name,
      value: category.id,
    };
  });
};

export const mapTagListToOption = (tagList) => {
  return tagList.map((tag) => {
    return {
      text: tag.name,
      value: tag.id,
    };
  });
};

export default function ProductAdmin(props) {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const { productList, page, limit, totalPage, loading } = useSelector(
    (state) => state.ProductReducer
  );

  const { categoryList } = useSelector((state) => state.CategoryReducer);
  const { tagList } = useSelector((state) => state.TagsReducer);

  const { importList, exportList } = useSelector((state) => state.DataAccess);

  const fetchProductData = () => {
    // console.log("fetchProductData");
    dispatch(getAllProductNoPaging());
  };

  useEffect(() => {
    let Components = [
      {
        tooltip: "Import product",
        icon: `<i className="fa-solid fa-right-to-bracket" />`,
        contentComponentType: "FormImportProduct",
      },
      {
        tooltip: "Export product",
        icon: `<i className="fa-solid fa-right-from-bracket" />`,
        contentComponentType: "FormExportProduct",
      },
      {
        tooltip: "Create new product",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormCreateProduct",
      },
      {
        tooltip: "Category Management",
        icon: `<i className="fa-solid fa-list" />`,
        contentComponentType: "CategoryManagement",
        navigateTo: "/admin/warehouse/categories",
      },
      {
        tooltip: "Tag Management",
        icon: `<i className="fa-solid fa-book" />`,
        contentComponentType: "TagManagement",
        navigateTo: "/admin/warehouse/tags",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryApi());
    dispatch(getAllTagsApi());
    fetchProductData();
    dispatch(getAllImportExportAPI());
  }, []);

  // columns of table
  const columns = [
    {
      title: "Product's Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, { category_id }) => {
        // console.log("category_id", category_id);
        const renderCategory = categoryList.find(
          (category) => category.id === category_id
        );
        return <p style={{ margin: 0 }}>{renderCategory?.name}</p>;
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
            <p style={{ margin: 0 }}>This product dont have any tags</p>
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
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Do you want to delete this product?"
            okButtonProps={{
              type: "text",
            }}
            cancelButtonProps={{
              type: "text",
            }}
            onConfirm={() => {
              dispatch(deleteProductApi(record.id));
            }}
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const importExportColumns = [
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <p style={{ margin: 0 }}>{new Date(text).toLocaleString()}</p>
      ),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
  ];

  return (
    <div>
      <div>
        <h5>
          <i className="fas fa-list" /> Product List
        </h5>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={productList}
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="col-span-1">
          <h5>
            <i className="fas fa-history" /> Import history
          </h5>
          <Table
            rowKey={(record) => record.id}
            columns={importExportColumns}
            dataSource={importList}
          />
        </div>
        <div className="col-span-1">
          <h5>
            <i className="fas fa-history" /> Export history
          </h5>
          <Table
            rowKey={(record) => record.id}
            columns={importExportColumns}
            dataSource={exportList}
          />
        </div>
      </div>
    </div>
  );
}
