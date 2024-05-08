import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  assignTagToProductApi,
  editProductApi,
  getProductByIdApi,
  uploadImageApi,
} from "../../../../redux/reducers/ProductReducer";
import {
  API_DOMAIN,
  ROLE,
  STATUS_CODE,
} from "../../../../utils/constants/settingSystem";
import { getAllCategoryApi } from "../../../../redux/reducers/CategoryReducer";
import { Select, Tag, Upload, Image, Table } from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

// css
import style from "./ProductDetails.module.css";
import { getAllTagsApi, removeTagFromProductApi } from "../../../../redux/reducers/TagsReducer";
import { deleteProcessApi, deleteProcessDetailApi, getProcessByProductId, setProcessDetailEdit, setProcessEdit } from "../../../../redux/reducers/ProcessReducer";
import { setComponentsAction } from "../../../../redux/reducers/FunctionPopupReducer";
import _ from "lodash";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProductDetails(props) {

  const navigate = useNavigate();

  const { id } = useParams();
  const dispatch = useDispatch();
  //   console.log("id", id);

  const [isEdit, setIsEdit] = useState(false);

  const { userLoginInfo } = useSelector((state) => state.LoginReducer);

  const { productList } = useSelector((state) => state.ProductReducer);
  const { materialList } = useSelector((state) => state.MaterialReducer);
  const { productEdit } = useSelector((state) => state.ProductReducer);
  const { categoryList } = useSelector((state) => state.CategoryReducer);
  const { tagList } = useSelector((state) => state.TagsReducer);
  // get Product Details from api by calling get product by ID and render the details page

  const [afterEdit, setAfterEdit] = useState({});

  const { processByProductId } = useSelector((state) => state.ProcessReducer);

  const columnsOfProcess = [
    {
      title: "Process Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Process Name",
      dataIndex: "process_name",
      key: "process_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      record: (text, record) => {
        console.log(record.created_at);
        return new Date(record.created_at).toLocaleString();
      },
    },
    {
      title: "Last Update",
      dataIndex: "updated_at",
      key: "updated_at",
      record: (text, record) => {
        return new Date(record.updated_at).toLocaleString();
      },
    },
    userLoginInfo?.roleId === ROLE.PRODUCTIONMANAGER.id ? {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (text, record) => {
        return (
          <div>
            <button
              onClick={() => {
                dispatch(setProcessEdit(record));
                const action = {
                  type: "ModalReducer/setModalOpen",
                  title: "Edit Process",
                  contentComponentType: "FormEditProcess",
                }
                dispatch(action);
              }}
              className="btn btn-warning"
            >
              Edit
            </button>
            <button
              onClick={() => {
                // call api to delete process
                dispatch(deleteProcessApi(record.id, record.product_id));
              }}
              className="btn btn-danger ms-3"
            >
              Delete
            </button>
          </div>
        );
      }
    } : {}
  ];

  useEffect(() => {
    let Components = [];
    if (userLoginInfo?.roleId === ROLE.PRODUCTIONMANAGER.id) {
      Components = [
        {
          tooltip: "Create new process",
          icon: `<i className="fa-solid fa-plus />`,
          contentComponentType: "FormAddProcess",
        }
      ];
    } else {
      Components = [];
    }
    dispatch(setComponentsAction(Components));
    dispatch(getProductByIdApi(id));
    dispatch(getAllCategoryApi());
    dispatch(getAllTagsApi());
    dispatch(getProcessByProductId(id));
    setAfterEdit(productEdit);
    if (productEdit?.img !== undefined && productEdit?.img !== null) {
      setPicture([
        {
          uid: productEdit.id,
          name: productEdit.name,
          status: "done",
          url: `${API_DOMAIN}/products/images/${productEdit.img}`,
        },
      ]);
    }
  }, [productEdit.id, productEdit.name, productEdit.img]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [picture, setPicture] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // uploadbutton
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div>
      <div>
        <h3 className="mb-3">Product Details</h3>
        <div className="grid grid-cols-8 gap-3">
          <div className="col-span-3">
            <Upload
              fileList={picture}
              listType="picture-card"
              onPreview={handlePreview}
              customRequest={async ({ file, onSuccess }) => {
                //   console.log(file);
                const formData = new FormData();
                formData.append("file", file);
                const data = {
                  id: productEdit.id,
                  img: formData,
                };
                const result = await Promise.resolve(
                  dispatch(uploadImageApi(data))
                );
                if (result.status === STATUS_CODE.SUCCESS) {
                  alert(result.data);
                  // reload product by id
                  // dispatch(getProductByIdApi(productEdit.id));
                  setPicture([
                    {
                      uid: productEdit.id,
                      name: productEdit.name,
                      status: "done",
                      url: `${API_DOMAIN}/products/images/${productEdit.img}`,
                    },
                  ]);
                  onSuccess("OK");
                }
              }}
              onRemove={(file) => { }}
            >
              {uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </div>
          <form
            className="col-span-5"
            onSubmit={(e) => {
              e.preventDefault();
              console.log(afterEdit);
              const editProduct = {
                id: afterEdit.id,
                product_name: afterEdit.name,
                price: afterEdit.price,
                quantity: afterEdit.quantity,
                category_id: afterEdit.category_id,
              };
              dispatch(editProductApi(editProduct));
              setIsEdit(false);
            }}
          >
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="product_name">
                Product's Name
              </label>
              {isEdit ? (
                <input
                  type="text"
                  className={`form-control ${style.inputProductDetails}`}
                  id="product_name"
                  name="product_name"
                  value={afterEdit.name}
                  onChange={(e) => {
                    setAfterEdit({ ...afterEdit, name: e.target.value });
                  }}
                />
              ) : (
                <h6
                  className="cursor-pointer mb-0 py-[6px] border-b border-black"
                  onClick={() => setIsEdit(true)}
                >
                  {productEdit.name}
                </h6>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="category_id">
                Category
              </label>
              {isEdit ? (
                <select
                  className={`form-select ${style.inputProductDetails}`}
                  id="category_id"
                  name="category_id"
                  value={afterEdit.category_id}
                  onChange={(e) =>
                    setAfterEdit({ ...afterEdit, category_id: e.target.value })
                  }
                >
                  {categoryList.map((category, index) => {
                    return (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <h6
                  className="cursor-pointer mb-0 py-[6px] border-b border-black"
                  onClick={() => setIsEdit(true)}
                >
                  {productEdit.category_name}
                </h6>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="price">
                Price
              </label>
              {isEdit ? (
                <input
                  type="text"
                  className={`form-control ${style.inputProductDetails}`}
                  id="price"
                  name="price"
                  value={afterEdit.price}
                  onChange={(e) =>
                    setAfterEdit({ ...afterEdit, price: e.target.value })
                  }
                />
              ) : (
                <h6
                  className="cursor-pointer mb-0 py-[6px] border-b border-black"
                  onClick={() => setIsEdit(true)}
                >
                  {productEdit.price?.toLocaleString() + " VND"}
                </h6>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="quantity">
                Quantity
              </label>
              {isEdit ? (
                <input
                  type="text"
                  className={`form-control ${style.inputProductDetails}`}
                  id="quantity"
                  name="quantity"
                  value={afterEdit.quantity}
                  onChange={(e) =>
                    setAfterEdit({ ...afterEdit, quantity: e.target.value })
                  }
                />
              ) : (
                <h6
                  className="cursor-pointer mb-0 py-[6px] border-b border-black"
                  onClick={() => setIsEdit(true)}
                >
                  {productEdit.quantity}
                </h6>
              )}
            </div>
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="tags">
                Tags
              </label>
              <div>
                {productEdit.tags?.map((tag, index) => {
                  return (
                    <Tag
                      closeIcon
                      onClose={(e) => {
                        e.preventDefault();
                        // call api to remove tag from product
                        dispatch(removeTagFromProductApi(tag.id, productEdit.id));
                      }}
                      key={index}
                    >
                      {tag.name}
                    </Tag>
                  );
                })}
                {isEdit ? (
                  <Select
                    placeholder="Select Tags"
                    size="small"
                    showSearch
                    value={null}
                    onSelect={(value) => {
                      // call api to assign tag to product
                      const data = {
                        tag_id: value,
                        product_id: productEdit.id,
                      };
                      dispatch(assignTagToProductApi(data));
                      // reset the selected value
                    }}
                  >
                    {tagList.map((tag, index) => {
                      if (
                        productEdit.tags?.findIndex(
                          (item) => item.id === tag.id
                        ) === -1
                      ) {
                        return (
                          <Select.Option key={index} value={tag.id}>
                            {tag.name}
                          </Select.Option>
                        );
                      }
                    })}
                  </Select>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      setIsEdit(true);
                    }}
                  >
                    <Tag>+ Add More</Tag>
                  </button>
                )}
              </div>
            </div>
            {isEdit ? (
              <div className="form-group mb-3 text-end">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEdit(false);
                  }}
                  type="button"
                  className="btn btn-danger ms-3"
                >
                  Cancel
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
      <div className="mt-5">
        <div>
          <h3 className="mb-3">Process of Product</h3>
        </div>
        <Table
          rowKey={(record) => record.id}
          columns={columnsOfProcess}
          dataSource={processByProductId}
          expandable={{
            rowExpandable: (record) => true,
            expandedRowRender: (record) => {
              const columns = [
                {
                  title: "Detail Name",
                  dataIndex: "detail_name",
                  key: "detail_name",
                },
                {
                  title: "Intensity",
                  dataIndex: "intensity",
                  key: "intensity",
                },
                {
                  title: "Input Material",
                  dataIndex: "in_material_id",
                  key: "in_material_id",
                  render: (text, record) => {
                    return record.material_name;
                  }
                },
                {
                  title: "Output",
                  dataIndex: "out_id",
                  key: "out_id",
                  render: (text, record) => {
                    console.log(record.is_final);
                    return record.is_final ? `Final Product: ${productList.find((product) => product.id === record.out_id)?.name}`
                      : `Material: ${materialList.find((material) => material.id === record.out_id)?.name}`;
                  }
                },
                {
                  title: "Last Update",
                  dataIndex: "updated_at",
                  key: "updated_at",
                  render: (text, record) => {
                    return new Date(record.updated_at).toLocaleString();
                  },
                },
                {
                  title: "Created At",
                  dataIndex: "created_at",
                  key: "created_at",
                  render: (text, record) => {
                    return new Date(record.created_at).toLocaleString();
                  },
                },
                userLoginInfo?.roleId === ROLE.PRODUCTIONMANAGER.id ? {
                  title: "Action",
                  dataIndex: "action",
                  key: "action",
                  render: (text, record) => {
                    return (
                      <div>
                        <button
                          onClick={() => {
                            dispatch(setProcessDetailEdit(record));
                            const action = {
                              type: "ModalReducer/setModalOpen",
                              title: "Edit Process Detail",
                              contentComponentType: "FormEditProcessDetail",
                            }
                            dispatch(action);
                          }}
                          className="btn btn-warning"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            console.log(record);
                            // call api to delete process detail
                            dispatch(deleteProcessDetailApi(record.id, productEdit.id, record.process_id));
                          }}
                          className="btn btn-danger ms-3"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  }
                } : {}
              ];
              const data = _.sortBy(record.process_details, ["intensity"]);
              return (
                <div>
                  <button onClick={() => {
                    dispatch(setProcessEdit(record));
                    const action = {
                      type: "ModalReducer/setModalOpen",
                      title: "Add Process Detail",
                      contentComponentType: "FormAddProcessDetail",
                    }
                    dispatch(action);
                  }}
                    className="btn btn-success">
                    Create new process detail
                  </button>
                  <Table
                    pagination={{
                      hideOnSinglePage: true,
                    }}
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={data}
                    rowClassName={"cursor-pointer"}
                  />
                </div>
              );
            },
          }}
        />
      </div>
    </div >
  );
}
