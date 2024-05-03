import React, { useEffect, useState } from "react";
import { usePathList } from "../../utils/Hooks/usePathList";
import { Breadcrumb, Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { NotificationFilled, WechatOutlined } from "@ant-design/icons";
import Clock from "../../components/Clock/Clock";
import FunctionPopup from "../../components/FunctionPopup/FunctionPopup";
import { useDispatch, useSelector } from "react-redux";
import { ROLE } from "../../utils/constants/settingSystem";
import { logoutApi } from "../../redux/reducers/LoginReducer";

const activeStyle = (isActive, collapse) => {
  return {
    backgroundColor: isActive ? "#1F2530" : "rgb(41, 53, 67)",
    width: "100%",
    height: "50px",
    display: "flex",
    alignItems: "center",
    padding: "0px 12px",
    textDecoration: "none",
    color: "white",
    justifyContent: collapse ? "center" : "flex-start",
  };
};

export default function WarehouseTemplates(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(true);

  const pathItem = usePathList();

  const { userLoginInfo } = useSelector((state) => state.LoginReducer);

  useEffect(() => {
    if (userLoginInfo.token === "" || userLoginInfo.token === undefined) {
      alert("Please login first");
      navigate("/");
    } else {
      if (userLoginInfo.roleId !== ROLE.WAREHOUSE.id) {
        alert("You are not authorized to access this page");
        navigate("/");
      }
    }
  })

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <FunctionPopup />
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "#293543",
          maxWidth: "20%",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 99,
        }}
        collapsedWidth={50}
        onMouseEnter={() => {
          setCollapsed(false);
        }}
        onMouseLeave={() => {
          setCollapsed(true);
        }}
      >
        <div
          style={{
            background: "#ffd700",
            height: "50px",
            display: "flex",
            justifyContent: collapsed ? "center" : "end",
            alignItems: "center",
          }}
        >
          <button className="btn btn-danger" style={{
            display: collapsed ? "none" : "block",
          }} onClick={() => {
            dispatch(logoutApi())
            navigate("/")
          }}>
            Sign Out
          </button>
          <button className="btn" style={{ border: "none" }} disabled={true}>
            <i className="fa-solid fa-bars" />
          </button>
        </div>
        <div>
          <div
            style={{
              width: "100%",
              // height: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              style={{
                backgroundColor: "#293543",
                width: "100%",
                height: "50px",
                display: "flex",
                alignItems: "center",
                padding: "0px 12px",
                textDecoration: "none",
                color: "white",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              disabled={collapsed ? true : false}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#warehouseCollapse"
              aria-expanded="false"
              aria-controls="warehouseCollapse"
            >
              <i
                className="fab fa-dropbox"
                style={{ marginRight: "6px", fontSize: "20px" }}
              />{" "}
              {collapsed ? "" : "Warehouse"}
            </button>
            <div
              style={{
                width: "100%",
                textAlign: "center",
                visibility: collapsed ? "hidden" : "visible",
                transition: "all 0.5s",
              }}
              className={`collapse ${collapsed ? "" : "show"}`}
              id="warehouseCollapse"
            >
              <NavLink
                to="products"
                className={({ isActive }) => {
                  return isActive ? "active" : "";
                }}
                style={({ isActive }) => {
                  return activeStyle(isActive);
                }}
              >
                Products
              </NavLink>
              <NavLink
                to="materials"
                className={({ isActive }) => {
                  return isActive ? "active" : "";
                }}
                style={({ isActive }) => activeStyle(isActive)}
              >
                Materials
              </NavLink>
            </div>
          </div>
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: 50,
        }}
      >
        <Header
          style={{
            // padding: 0,
            backgroundColor: "#fff",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          }}
        >
          <h6 style={{ textTransform: "uppercase", margin: 0 }}>{<Clock />}</h6>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#000",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <WechatOutlined
                style={{
                  fontSize: "30px",
                  color: "#fff",
                }}
              />
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#ffd700",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotificationFilled style={{ fontSize: "30px", color: "#000" }} />
            </div>
            <div className="ml-3 px-5 bg-[#f1c40f] text-black text-right">
              <h5 className="m-0 uppercase">{userLoginInfo.username}</h5>
              <h6 className="m-0">Warehouse Manager</h6>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "0",
            backgroundColor: "#FFFCEE",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px",
              textTransform: "capitalize",
            }}
            items={pathItem}
          ></Breadcrumb>
          <div
            style={{
              background: "#FFFCEE",
              padding: "0px 16px",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          GEITTECH ©{new Date().getFullYear()} Created by THOAG of GEITTECH
        </Footer>
      </Layout>
    </Layout>
  );
}
