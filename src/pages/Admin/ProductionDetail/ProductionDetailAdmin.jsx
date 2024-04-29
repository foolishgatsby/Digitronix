import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { deleteProductionDetailApi, editProductionDetailAPI, getProductionDetailByIdApi } from "../../../redux/reducers/ProductionReducer";
import { Tag } from "antd";

import style from "./ProductionDetailAdmin.module.css";
import { setComponentsAction } from "../../../redux/reducers/FunctionPopupReducer";

export default function ProductionDetailAdmin(props) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { productionDetailEdit } = useSelector(
        (state) => state.ProductionReducer
    );

    const [isEdit, setIsEdit] = React.useState(false);

    const [inMaterialQuantity, setInMaterialQuantity] = React.useState(0);
    const [outQuantity, setOutQuantity] = React.useState(0);

    useEffect(() => {
        let Components = [];
        dispatch(setComponentsAction(Components));
        dispatch(getProductionDetailByIdApi(id));
    }, [id]);

    useEffect(() => {
        if (productionDetailEdit) {
            setInMaterialQuantity(productionDetailEdit?.in_material_quantity || 0);
            setOutQuantity(productionDetailEdit?.out_quantity || 0);
        }
    }, [productionDetailEdit]);
    //   console.log("id", id);
    return (
        <div>
            <div className="flex justify-between">
                <h3>Production Detail</h3>
                <div>
                    {isEdit ? <button className="btn btn-primary" onClick={() => {
                        const data = {
                            ...productionDetailEdit,
                            in_material_quantity: inMaterialQuantity,
                            out_quantity: outQuantity,
                            time_start: productionDetailEdit.time_start.split("T").join(" "),
                            time_end: productionDetailEdit.time_end.split("T").join(" "),
                        }
                        dispatch(editProductionDetailAPI(data));
                        setIsEdit(false);
                    }}>Save</button> : <button className="btn btn-primary" onClick={() => {
                        setIsEdit(true);
                    }}>
                        Edit
                    </button>}
                    {isEdit ? <button className="btn btn-danger ml-2" onClick={() => {
                        setIsEdit(false);
                    }}>Cancel</button> : <button className="btn btn-danger ml-2" onClick={() => {
                        dispatch(deleteProductionDetailApi(id));
                        navigate("/admin/productions")
                    }}>
                        Delete
                    </button>}
                </div>
            </div>
            <div className={`mt-4 text-lg ${style.productionDetailCard} w-1/2 mx-auto`}>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <label className="mr-2 font-bold">Production Detail Name: </label>
                        <span onClick={() => {
                            setIsEdit(true);
                        }}>{productionDetailEdit.name}</span>
                    </div>
                    <div>
                        <label className="mr-2 font-bold">Status: </label>
                        <Tag
                            color={
                                productionDetailEdit.status === "done"
                                    ? "green"
                                    : productionDetailEdit.status === "processing"
                                        ? "yellow"
                                        : "default"
                            }
                            className="text-lg uppercase"
                        >
                            {productionDetailEdit.status}
                        </Tag>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <label className="mr-2 font-bold">Material use:</label>
                        <span>{productionDetailEdit.material_name}</span>
                    </div>
                    <div>
                        <label className="mr-2 font-bold">Quantity:</label>
                        {isEdit ? <input style={{ width: "4rem", padding: "0 5px" }} type="number" value={inMaterialQuantity} onChange={(e) => { setInMaterialQuantity(e.target.value) }} /> : <span className="cursor-pointer" onClick={() => {
                            setIsEdit(true)
                        }}>{productionDetailEdit.in_material_quantity}</span>}
                    </div>
                </div>
                <div className="mb-2">
                    <label className="mr-2 font-bold">Quantity of finish goods:</label>
                    {isEdit ? <input style={{ width: "4rem", padding: "0 5px" }} type="number" value={outQuantity} onChange={(e) => { setOutQuantity(e.target.value) }} /> : <span className="cursor-pointer" onClick={() => {
                        setIsEdit(true)
                    }}>{productionDetailEdit.out_quantity}</span>}
                </div>
                <div className="mb-2">
                    <label className="mr-2 font-bold">Time start:</label>
                    <span>{productionDetailEdit.time_start?.split("T").join(" ")}</span>
                </div>
                <div>
                    <label className="mr-2 font-bold">Time end:</label>
                    <span>{productionDetailEdit.time_end?.split("T").join(" ")}</span>
                </div>
            </div>
        </div >
    );
}
