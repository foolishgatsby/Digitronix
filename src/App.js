import "./App.css";

// react router dom
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminTemplate from "./templates/AdminTemplates/AdminTemplate";
import AccountAdmin from "./pages/Admin/Account/AccountAdmin";
import ProductAdmin from "./pages/Admin/Product/ProductAdmin";
import MaterialAdmin from "./pages/Admin/Material/MaterialAdmin";
import OrderAdmin from "./pages/Admin/Order/OrderAdmin";
import CustomerAdmin from "./pages/Admin/Customer/CustomerAdmin";
import DeliveryAdmin from "./pages/Admin/Delivery/DeliveryAdmin";
import ProductionAdmin from "./pages/Admin/Production/ProductionAdmin";
import SaleTemplate from "./templates/SaleTemplates/SaleTemplate";
import ProductSale from "./pages/Sale/Product/ProductSale";
import OrderSale from "./pages/Sale/Order/OrderSale";
import CustomerSale from "./pages/Sale/Customer/CustomerSale";
import WarehouseTemplates from "./templates/WarehouseTemplates/WarehouseTemplates";
import ProductWarehouse from "./pages/Warehouse/Product/ProductWarehouse";
import ModalComponent from "./HOC/ModalComponent/ModalComponent";
import ProductDetails from "./pages/Admin/Product/ProductDetails/ProductDetails";
import MaterialDetails from "./pages/Admin/Material/MaterialDetails/MaterialDetails";
import TagManagement from "./pages/Admin/TagManagement/TagManagement";
import CategoryManagement from "./pages/Admin/CategoryManagement/CategoryManagement";
import MaterialCategoryManagement from "./pages/Admin/MaterialCategoryManagement/MaterialCategoryManagement";
import ProcessDetail from "./pages/Admin/ProcessDetail/ProcessDetail";
import CustomerDetails from "./pages/Admin/Customer/CustomerDetails/CustomerDetails";
import OrderDetails from "./pages/Admin/Order/OrderDetails/OrderDetails";
import MaterialWarehouse from "./pages/Warehouse/Material/MaterialWarehouse";
import ProductionDetailAdmin from "./pages/Admin/ProductionDetail/ProductionDetailAdmin";
import SalaryInformation from "./pages/Admin/SalaryInformation/SalaryInformation";
import ProductionTemplate from "./templates/ProductionTemplates/ProductionTemplate";
import ProductProduction from "./pages/Production/Product/ProductProduction";
import MaterialProduction from "./pages/Production/Material/MaterialProduction";

function App() {
  return (
    <BrowserRouter>
      <ModalComponent />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="" element={<Login />} />
        <Route path="admin" element={<AdminTemplate />}>
          <Route path="accounts" element={<AccountAdmin />} />
          <Route path="accounts/salary" element={<SalaryInformation />} />
          <Route path="warehouse">
            <Route
              index
              path=""
              element={<Navigate to="products" replace />}
            ></Route>
            <Route path="products" element={<ProductAdmin />}></Route>
            <Route path="products/:id" element={<ProductDetails />}></Route>
            <Route
              path="products/:id/process-detail/:processId"
              element={<ProcessDetail />}
            ></Route>
            <Route path="materials" element={<MaterialAdmin />}></Route>
            <Route path="materials/:id" element={<MaterialDetails />}></Route>

            <Route path="categories" element={<CategoryManagement />}></Route>
            <Route path="tags" element={<TagManagement />}></Route>
            <Route
              path="material-categories"
              element={<MaterialCategoryManagement />}
            ></Route>
          </Route>
          <Route path="orders" element={<OrderAdmin />}></Route>
          <Route path="orders/:id" element={<OrderDetails />}></Route>
          <Route path="customers" element={<CustomerAdmin />}></Route>
          <Route path="customers/:id" element={<CustomerDetails />}></Route>
          <Route path="deliveries" element={<DeliveryAdmin />}></Route>
          <Route path="productions" element={<ProductionAdmin />}></Route>
          <Route
            path="production-detail/:id"
            element={<ProductionDetailAdmin />}
          ></Route>
        </Route>
        <Route path="sale" element={<SaleTemplate />}>
          <Route path="products" element={<ProductSale />}></Route>
          <Route path="orders" element={<OrderSale />}></Route>
          <Route path="orders/:id" element={<OrderDetails />}></Route>
          <Route path="customers" element={<CustomerSale />}></Route>
          <Route path="customers/:id" element={<CustomerDetails />}></Route>
        </Route>
        <Route path="warehouse" element={<WarehouseTemplates />}>
          <Route path="products" element={<ProductWarehouse />}></Route>
          <Route path="materials" element={<MaterialWarehouse />}></Route>
          <Route path="categories" element={<CategoryManagement />}></Route>
          <Route path="tags" element={<TagManagement />}></Route>
          <Route
            path="material-categories"
            element={<MaterialCategoryManagement />}
          ></Route>
        </Route>
        <Route path="production" element={<ProductionTemplate />}>
          {/* Product Tab */}
          <Route
            path="warehouse"
            element={<Navigate to={"products"} replace />}
          />
          <Route path="warehouse/products" element={<ProductProduction />} />
          {/* Material Tab */}
          <Route path="warehouse/materials" element={<MaterialProduction />} />
          {/* Production Tab */}
          <Route path="productionsplan" element={<ProductionAdmin />} />
          <Route path="" element={<ProductionAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
