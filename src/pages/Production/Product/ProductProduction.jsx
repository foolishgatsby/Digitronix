import { Button, Input, Select, Space, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapTagListToOption } from "../../Admin/Product/ProductAdmin";
import { getAllProductNoPaging } from "../../../redux/reducers/ProductReducer";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { NavLink, useNavigate } from "react-router-dom";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { getAllCategoryApi } from "../../../redux/reducers/CategoryReducer";
import { getAllTagsApi } from "../../../redux/reducers/TagsReducer";

export default function ProductProduction(props) {
    useEffect(() => {
        let Components = [];
        dispatch(setComponentsAction(Components));
        dispatch(getAllCategoryApi());
        dispatch(getAllTagsApi());
        fetchProductData();
    }, []);

    const dispatch = useDispatch();

    const navigate = useNavigate();

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
        },
    });

    const { productList, loading } = useSelector((state) => state.ProductReducer);

    const { categoryList } = useSelector((state) => state.CategoryReducer);
    const { tagList } = useSelector((state) => state.TagsReducer);

    const fetchProductData = () => {
        // console.log("fetchProductData");
        dispatch(getAllProductNoPaging());
    };

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
    ];

    return (
        <div className="mt-3">
            <h5>
                <i className="fas fa-list" /> Product List
            </h5>
            <div className="">
                <Table
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={productList}
                    loading={loading}
                    rowClassName={(record, index) => {
                        return "cursor-pointer";
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => {
                                navigate(`/production/warehouse/products/${record.id}`)
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}
