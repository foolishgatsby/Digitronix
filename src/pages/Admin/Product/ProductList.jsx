import { Button, FloatButton, Input, Select, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import {
  getAllProductApi,
  setLimit,
  setProductEdit,
} from "../../../redux/reducers/ProductReducer";
import { getAllCategoryApi } from "../../../redux/reducers/CategoryReducer";
import { current } from "@reduxjs/toolkit";
import { size } from "lodash";
import { getAllTagsApi } from "../../../redux/reducers/TagsReducer";
import { useSearch } from "../../../utils/Hooks/useSearch";
import { NavLink } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

// const data = [
//   {
//     key: "1",
//     image: "https://picsum.photos/200",
//     productName: "Product 1",
//     category: "1",
//     tags: ["Xanh rêu", "Tình nhân", "16x14"],
//     quantity: 4000,
//   },
//   {
//     key: "2",
//     image: "https://picsum.photos/200",
//     productName: "Product 2",
//     category: "2",
//     tags: ["Đỏ", "Tình nhân"],
//     quantity: 500,
//   },
//   {
//     key: "3",
//     image: "https://picsum.photos/200",
//     productName: "Product 3",
//     category: "2",
//     tags: ["Kính tràn", "Tình nhân", "25x25"],
//     quantity: 60000,
//   },
// ];

const mapCategoryListToOption = (categoryList) => {
  return categoryList.map((category) => {
    return {
      label: category.name,
      value: category.id,
    };
  });
};

const mapTagListToOption = (tagList) => {
  return tagList.map((tag) => {
    return {
      text: tag.name,
      value: tag.id,
    };
  });
};

export default function ProductList() {
  const dispatch = useDispatch();

  const { categoryList } = useSelector((state) => state.CategoryReducer);
  const { tagList } = useSelector((state) => state.TagsReducer);
  const { productList, loading, page, limit, totalPage } = useSelector(
    (state) => state.ProductReducer
  );

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
            }}
          >
            Search
          </Button>
          <Button
            htmlType="button"
            onClick={() => clearFilters && handleReset(clearFilters)}
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
              confirm({
                closeDropdown: false,
              });
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
            close
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
            to={`${record.id}`}
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
      // return searchedColumn === dataIndex ? (
      //   <Highlighter
      //     to={`${record.id}`}
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : (
      //   text
      // );
    },
  });

  const fetchProductData = (page, limit) => {
    dispatch(getAllProductApi(page, limit));
  };

  const column = [
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
                <Tag color={"blue"} key={tag}>
                  {tag.toUpperCase()}
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
    // {
    //   title: "Action",
    //   key: "action",
    //   width: "15%",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <button
    //         onClick={() => {
    //           dispatch(setProductEdit(record));
    //           const action = {
    //             type: "ModalReducer/setModalOpen",
    //             title: "Edit Product",
    //             contentComponentType: "FormEditProduct",
    //           };
    //           dispatch(action);
    //         }}
    //         className="btn btn-primary"
    //       >
    //         <i className="fa fa-edit" /> Edit
    //       </button>
    //       <button className="btn btn-danger">
    //         <i className="fa fa-times-circle" /> Delete
    //       </button>
    //     </Space>
    //   ),
    // },
  ];

  useEffect(() => {
    let Components = [
      {
        tooltip: "Create new product",
        icon: `<i className="fa-solid fa-plus" />`,
        contentComponentType: "FormCreateProduct",
      },
      {
        tooltip: "Category Management",
        icon: `<i className="fa-solid fa-list" />`,
        contentComponentType: "CategoryManagement",
      },
      {
        tooltip: "Tag Management",
        icon: `<i className="fa-solid fa-book" />`,
        contentComponentType: "TagManagement",
      },
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryApi());
    dispatch(getAllTagsApi());
    fetchProductData(page, limit);
  }, []);

  const categoryOptions =
    size(categoryList) > 0 ? mapCategoryListToOption(categoryList) : [];

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  return (
    <div className="mt-3">
      <div className="">
        <Table
          rowKey={(record) => record.id}
          columns={column}
          dataSource={productList}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            pageSize: limit,
            total: totalPage,
            onShowSizeChange: (current, size) => {
              if (current === 1 || (current === page && size === limit)) return;
              fetchProductData(current - 1, size);
            },
            onChange: (currentPage, pageSize) => {
              if (
                currentPage === 1 ||
                (currentPage === page && pageSize === limit)
              )
                return;
              fetchProductData(page - 1, pageSize);
            },
          }}
        ></Table>
      </div>
    </div>
  );
}
