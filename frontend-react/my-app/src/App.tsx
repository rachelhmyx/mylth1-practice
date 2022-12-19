import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/Management/Categories/index";
import CustomerPage from "./pages/Management/Customers/index";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/management/categories" element={<CategoryPage />} />
          <Route path="/management/customers" element={<CustomerPage />} />
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
