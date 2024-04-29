import { Dropdown, Popconfirm, Tag } from "antd";
import React, { useEffect } from "react";

// css
import style from "./ProductionAdmin.module.css";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductionApi,
  getAllProductionApi,
  setProductionEdit,
} from "../../../redux/reducers/ProductionReducer";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";
import { NavLink } from "react-router-dom";

export const mapProductionDetailToItems = (productionDetails) => {
  return productionDetails.map((productionDetail, index) => {
    return {
      key: index,
      value: `Option ${index}`,
      label: (
        <NavLink
          className="no-underline"
          to={`/admin/production-detail/${productionDetail.id}`}
        >
          <div className="mb-2 border-b-2">
            <div>
              <p className="m-0">
                <strong>Production detail ID:</strong> {productionDetail.id}
              </p>
              <p className="m-0">
                <strong>Production detail name:</strong> {productionDetail.name}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="m-0">
                <strong>Material:</strong> {productionDetail.material_name} -{" "}
                <strong>Quantity:</strong>{" "}
                {productionDetail.in_material_quantity}
              </p>
              <Tag
                color={
                  productionDetail.status === "done"
                    ? "green"
                    : productionDetail.status === "processing"
                      ? "yellow"
                      : "default"
                }
                className="uppercase"
              >
                {productionDetail.status}
              </Tag>
            </div>
            <div>
              <p className="m-0">
                <strong>Number of finished goods:</strong>{" "}
                {productionDetail.out_quantity}
              </p>
            </div>
            <div>
              <strong>Time:</strong>{" "}
              {productionDetail.time_start
                ? productionDetail.time_start.split("T").join(" ")
                : "Not start yet"}{" "}
              :{" "}
              {productionDetail.time_end
                ? productionDetail.time_end.split("T").join(" ")
                : "Not end yet"}
            </div>
          </div>
        </NavLink>
      ),
    };
  });
};

export default function ProductionAdmin(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productionList } = useSelector((state) => state.ProductionReducer);

  useEffect(() => {
    let Components = [
      {
        tooltip: "Add new production",
        icon: `<i className="fa fa-plus" />`,
        contentComponentType: "FormAddProduction",
      },
    ];
    dispatch(setComponentsAction(Components));
    // call api get all production
    dispatch(getAllProductionApi());
  }, []);

  return (
    <div className="w-1/2 mx-auto">
      {productionList.map((production, index) => {
        return (
          <div className={style.productionCard} key={index}>
            <Dropdown
              trigger={"click"}
              menu={{
                items: mapProductionDetailToItems(production.production_detail),
              }}
            >
              <div className="productionInfo">
                <div className="flex justify-end">
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "delete",
                          title: "Delete",
                          label: (
                            <Popconfirm
                              title="Are you sure to delete this production?"
                              onConfirm={() => {
                                dispatch(deleteProductionApi(production.id));
                              }
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              Delete
                            </Popconfirm>
                          ),
                          // onClick: () => {
                          //   // Delete order
                          //   dispatch(deleteProductionApi(production.id));
                          // },
                        },
                        {
                          key: "addProductionDetail",
                          title: "Add production detail",
                          label: "Add production detail",
                          onClick: () => {
                            dispatch(setProductionEdit(production));
                            const action = {
                              type: "ModalReducer/setModalOpen",
                              title: "Add Production Detail",
                              contentComponentType: "FormAddProductionDetail",
                            };
                            dispatch(action);
                          },
                        },
                        {
                          key: "edit",
                          title: "Edit",
                          label: "Edit",
                          onClick: () => {
                            dispatch(setProductionEdit(production));
                            const action = {
                              type: "ModalReducer/setModalOpen",
                              title: "Edit Production",
                              contentComponentType: "FormEditProduction",
                            };
                            dispatch(action);
                          },
                        },
                      ],
                    }}
                  >
                    <i className="fas fa-ellipsis"></i>
                  </Dropdown>
                </div>
                <div className="flex justify-content-between">
                  <p className="productionName">
                    <span className="text-yellow-500 font-semibold">
                      Product:
                    </span>{" "}
                    {production.product_name}
                  </p>
                  <p>
                    Order ID:{" "}
                    <span className="text-yellow-500 font-bold">
                      {production.order_id}
                    </span>
                  </p>
                </div>
                <div className="flex justify-content-between items-center">
                  <p>
                    <span className="text-green-500 font-bold">Quantity: </span>
                    {production.quantity}
                  </p>
                  <p className="productionStatus">
                    Status:{" "}
                    <Tag
                      color={
                        production.status === "done"
                          ? "green"
                          : production.status === "pending"
                            ? "yellow"
                            : "default"
                      }
                      className="text-lg uppercase"
                    >
                      {production.status}
                    </Tag>
                  </p>
                </div>
                <div className="flex justify-content-between">
                  <p>
                    <span className="font-bold">Start day:</span>{" "}
                    {production.time_start}
                  </p>
                  <p>
                    <span className="font-bold">Deadline:</span>{" "}
                    {production.time_end}
                  </p>
                </div>
                <div className="flex justify-content-between">
                  <p>
                    <span className="font-bold">People in charge:</span>{" "}
                    {production.user_name}
                  </p>
                  <p>
                    <span className="font-bold">Total Cost:</span>{" "}
                    {production.total_cost}$
                  </p>
                </div>
              </div>
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
}
