import { CommentOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import { useNavigate } from "react-router";
import { setCustomerFavorite } from "../../redux/reducers/CustomerReducer";

function FunctionPopup(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Components } = useSelector((state) => state.FunctionPopupReducer);

  // when the state of Components change, the component will re-render
  useEffect(() => {
    // console.log(Components);
  }, [Components]);

  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="default"
        style={{
          right: 20,
          color: "#ffd700",
        }}
        icon={<i className="fa-solid fa-ellipsis" />}
      >
        {/* <FloatButton icon={<CommentOutlined />} />
        <FloatButton icon={<CommentOutlined />} /> */}

        {Components.map((component, index) => {
          return (
            <FloatButton
              key={index}
              icon={parse(component.icon)}
              tooltip={component.tooltip}
              onClick={() => {
                if (component.isFilterFunction) {
                  const action = {
                    type: "CustomerReducer/setCustomerFavorite",
                  };
                  dispatch(action);
                  return;
                }
                if (component.navigateTo) {
                  navigate(component.navigateTo);
                  return;
                } else {
                  const action = {
                    type: "ModalReducer/setModalOpen",
                    title: component.tooltip,
                    contentComponentType: component.contentComponentType,
                  };
                  dispatch(action);
                  return; // return to avoid the next dispatch
                }
              }}
            />
          );
        })}
      </FloatButton.Group>
    </>
  );
}

export default FunctionPopup;
