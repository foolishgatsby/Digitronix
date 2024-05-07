import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalCancel,
  setModalOpen,
} from "../../redux/reducers/ModalReducer";
import FormEditAccount from "../../components/Form/FormEditAccount";
import FormCreateAccount from "../../components/Form/FormCreateAccount";
import FormCreateProduct from "../../components/Form/FormCreateProduct";
import FormCreateMaterial from "../../components/Form/FormCreateMaterial";
import FormCreateCategory from "../../components/Form/FormCreateCategory";
import FormCreateMaterialCategory from "../../components/Form/FormCreateMaterialCategory";
import FormEditCategory from "../../components/Form/FormEditCategory";
import FormEditCategoryMaterial from "../../components/Form/FormEditCategoryMaterial";
import FormEditTag from "../../components/Form/FormEditTag";
import FormAddTag from "../../components/Form/FormAddTag";
import FormAddProcess from "../../components/Form/FormAddProcess";
import FormAddCustomer from "../../components/Form/FormAddCustomer";
import FormEditCustomerInformation from "../../components/Form/FormEditCustomerInformation";
import FormImportProduct from "../../components/Form/FormImportProduct";
import FormExportProduct from "../../components/Form/FormExportProduct";
import FormAddOrderForCustomer from "../../components/Form/FormAddOrderForCustomer";
import FormAddOrder from "../../components/Form/FormAddOrder";
import FormAddProduction from "../../components/Form/FormAddProduction";
import FormEditProduction from "../../components/Form/FormEditProduction";
import FormAddProductionDetail from "../../components/Form/FormAddProductionDetail";
import FormEditOrder from "../../components/Form/FormEditOrder";
import FormAddDelivery from "../../components/Form/FormAddDelivery";
import FormImportMaterial from "../../components/Form/FormImportMaterial";
import FormEditSalary from "../../components/Form/FormEditSalary";
import FormAddProcessDetail from "../../components/Form/FormAddProcessDetail";

// mapping componet from component type
const componentMapping = {
  FormEditAccount: FormEditAccount,
  FormCreateAccount: FormCreateAccount,
  FormCreateProduct: FormCreateProduct,
  FormCreateMaterial: FormCreateMaterial,
  FormCreateCategory: FormCreateCategory,
  FormCreateMaterialCategory: FormCreateMaterialCategory,
  FormEditCategory: FormEditCategory,
  FormEditCategoryMaterial: FormEditCategoryMaterial,
  FormAddTag: FormAddTag,
  FormEditTag: FormEditTag,
  FormAddProcess: FormAddProcess,
  FormAddCustomer: FormAddCustomer,
  FormEditCustomerInformation: FormEditCustomerInformation,
  FormImportProduct: FormImportProduct,
  FormExportProduct: FormExportProduct,
  FormAddOrderForCustomer: FormAddOrderForCustomer,
  FormAddOrder: FormAddOrder,
  FormAddProduction: FormAddProduction,
  FormEditProduction: FormEditProduction,
  FormAddProductionDetail: FormAddProductionDetail,
  FormEditOrder: FormEditOrder,
  FormAddDelivery: FormAddDelivery,
  FormImportMaterial: FormImportMaterial,
  FormEditSalary: FormEditSalary,
  FormAddProcessDetail: FormAddProcessDetail,
  // Add more mappings here if needed
};

// const submitFuncMapping = {
//   updateUserApi: updateUserApi,
// };

export default function ModalComponent(props) {
  const formRef = useRef();

  // const handleOk = () => {
  // };

  const { isModalOpen, title, contentComponentType } = useSelector(
    (state) => state.ModalReducer
  );

  // const { accountEdit } = useSelector((state) => state.UserReducer);

  const dispatch = useDispatch();

  const ModalContent = componentMapping[contentComponentType];

  // const submitFunc = submitFuncMapping[submitFuncName];

  useEffect(() => {
    // console.log("ModalContent", ModalContent);
    // console.log("accountEdit", accountEdit);
    console.log("ref", formRef.current);
  }, [isModalOpen, formRef]);

  return isModalOpen ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-4 py-3 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  dispatch(setModalCancel());
                }}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <ModalContent
                ref={formRef}
                dispatch={dispatch}
              // accountEdit={accountEdit}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  dispatch(setModalCancel());
                }}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  if (formRef.current) {
                    formRef.current.submitForm();
                  } else {
                    console.log("FormRef is null");
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        id="modal-id-backdrop"
      ></div>
    </>
  ) : null;
}
