import React from "react";
import numeral from "numeral";
import "numeral/locales/vi";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/Management/Categories/index";
import CustomerPage from "./pages/Management/Customers/index";
import EmployeePage from "./pages/Management/Employees/index";
import ProductPage from "./pages/Management/Products/index";

numeral.locale("vi");

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/management/categories" element={<CategoryPage />} />
          <Route path="/management/customers" element={<CustomerPage />} />
          <Route path="/management/employees" element={<EmployeePage />} />
          <Route path="/management/products" element={<ProductPage />} />
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
      </BrowserRouter>
    </div>
  );
}

export default App;
