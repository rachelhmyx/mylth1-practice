import React from "react";
import numeral from "numeral";
import "numeral/locales/vi";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import CategoryPage from "./pages/Management/Categories/index";
import CustomerPage from "./pages/Management/Customers/index";
import EmployeePage from "./pages/Management/Employees/index";
import ProductPage from "./pages/Management/Products/index";
import SupplierPage from "./pages/Management/Suppliers";
import HomePage from "./pages/HomePage/index";
import SideMenuBar from "./components/SideMenuBar";

const { Header, Footer, Sider, Content } = Layout;

numeral.locale("vi");

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Sider>
            <SideMenuBar />
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content>
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route
                  path="/management/categories"
                  element={<CategoryPage />}
                />
                <Route
                  path="/management/customers"
                  element={<CustomerPage />}
                />
                <Route
                  path="/management/employees"
                  element={<EmployeePage />}
                />
                <Route path="/management/products" element={<ProductPage />} />
                <Route
                  path="/management/suppliers"
                  element={<SupplierPage />}
                />
                {/* NO MATCH ROUTE */}
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>404 Page not found</p>
                    </main>
                  }
                />
              </Routes>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
