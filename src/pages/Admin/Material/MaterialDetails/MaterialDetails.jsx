import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoryMaterialApi } from "../../../../redux/reducers/CategoryReducer";
import {
  API_DOMAIN,
  STATUS_CODE,
} from "../../../../utils/constants/settingSystem";

// css
import style from "./MaterialDetails.module.css";
import { Image, Select, Tag, Upload } from "antd";
import { useParams } from "react-router";
import {
  assignTagToMaterialApi,
  editMaterialApi,
  getMaterialByIdApi,
} from "../../../../redux/reducers/MaterialReducer";
import { uploadImageApi } from "../../../../redux/reducers/ProductReducer";
import { getAllTagsApi, removeTagFromMaterialApi } from "../../../../redux/reducers/TagsReducer";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function MaterialDetails(props) {
  const dispatch = useDispatch();

  const { id } = useParams();

  const { materialEdit } = useSelector((state) => state.MaterialReducer);
  const { categoryMaterialList } = useSelector(
    (state) => state.CategoryReducer
  );
  const { tagList } = useSelector((state) => state.TagsReducer);

  const [afterEdit, setAfterEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(getMaterialByIdApi(id));
    dispatch(getAllCategoryMaterialApi());
    dispatch(getAllTagsApi());
    setAfterEdit(materialEdit);
    if (materialEdit?.image !== null && materialEdit?.image !== undefined) {
      setPicture([
        {
          uid: materialEdit.id,
          name: materialEdit.name,
          status: "done",
          url: `${API_DOMAIN}/materials/images/${materialEdit.image}`,
        },
      ]);
    }
  }, [materialEdit.id, materialEdit.name, materialEdit.img]);

  console.log(materialEdit);

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

  // upload button
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
      <h3 className="mb-3">Material Details</h3>
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
                id: materialEdit.id,
                img: formData,
              };
              const result = await Promise.resolve(
                dispatch(uploadImageApi(data))
              );
              if (result.status === STATUS_CODE.SUCCESS) {
                alert(result.data);
                // reload product by id
                // dispatch(getProductByIdApi(materialEdit.id));
                setPicture([
                  {
                    uid: materialEdit.id,
                    name: materialEdit.name,
                    status: "done",
                    url: `${API_DOMAIN}/products/images/${materialEdit.image}`,
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
            const editMaterial = {
              id: afterEdit.id,
              material_name: afterEdit.name,
              price: afterEdit.price,
              quantity: afterEdit.quantity,
              category_id: afterEdit.category_id,
            };
            // dispatch(editProductApi(editProduct));
            dispatch(editMaterialApi(editMaterial));
            setIsEdit(false);
          }}
        >
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="material_name">
              Material Name
            </label>
            {isEdit ? (
              <input
                type="text"
                className={`form-control ${style.inputMaterialDetails}`}
                id="material_name"
                name="material_name"
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
                {materialEdit.name}
              </h6>
            )}
          </div>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="category_id">
              Category
            </label>
            {isEdit ? (
              <select
                className={`form-select ${style.inputMaterialDetails}`}
                id="category_id"
                name="category_id"
                value={afterEdit.category_id}
                onChange={(e) =>
                  setAfterEdit({ ...afterEdit, category_id: e.target.value })
                }
              >
                {categoryMaterialList.map((category, index) => {
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
                {materialEdit.category_name}
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
                className={`form-control ${style.inputMaterialDetails}`}
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
                {materialEdit.price?.toLocaleString() + " VND"}
              </h6>
            )}
          </div>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="tags">
              Tags
            </label>
            <div>
              {materialEdit.tags?.map((tag, index) => {
                return (
                  <Tag
                    closeIcon
                    onClose={(e) => {
                      // console.log(e);
                      // call api to remove tag from product
                      dispatch(removeTagFromMaterialApi(tag.id, materialEdit.id));
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
                      material_id: materialEdit.id,
                    };
                    dispatch(assignTagToMaterialApi(data));
                    // reset the selected value
                  }}
                >
                  {tagList.map((tag, index) => {
                    if (
                      materialEdit.tags?.findIndex(
                        (tagItem) => tagItem.id === tag.id
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
  );
}
