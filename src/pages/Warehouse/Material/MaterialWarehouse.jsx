import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllMaterialNoPaging } from "../../../redux/reducers/MaterialReducer";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { getAllCategoryApi } from "../../../redux/reducers/CategoryReducer";
import { getAllTagsApi } from "../../../redux/reducers/TagsReducer";
import { getAllImportExportMaterialAPI } from "../../../redux/reducers/DataAccess";
import { mapTagListToOption } from "../../Admin/Product/ProductAdmin";

export default function MaterialWarehouse(props) {

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

  const { materialList, loading } = useSelector((state) => state.MaterialReducer);

  const { categoryMaterialList } = useSelector((state) => state.CategoryReducer);
  const { tagList } = useSelector((state) => state.TagsReducer);

  const { importMaterialList, exportMaterialList } = useSelector((state) => state.DataAccess);

  const fetchMaterialData = () => {
    dispatch(getAllMaterialNoPaging());
  }

  useEffect(() => {
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
    ];
    dispatch(setComponentsAction(Components));
    dispatch(getAllCategoryApi());
    dispatch(getAllTagsApi());
    fetchMaterialData();
    dispatch(getAllImportExportMaterialAPI());
  }, [])

  const columns = [
    {
      title: "Material's Name",
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
  ]

  const importExportColumns = [
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (
        <p style={{ margin: 0 }}>{new Date(text).toLocaleString()}</p>
      ),
    },
    {
      title: "Material Name",
      dataIndex: "material_name",
      key: "material_name",
    },
    {
      title: "Quantity",
      dataIndex: "material_quantity",
      key: "material_quantity",
    },
  ];

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
          <Table columns={importExportColumns} dataSource={importMaterialList} />
        </div>
        <div className="col-span-1">
          <h5>
            <i className="fas fa-history" /> Export history
          </h5>
          <Table columns={importExportColumns} dataSource={exportMaterialList} />
        </div>
      </div>
    </div>
  );
}
