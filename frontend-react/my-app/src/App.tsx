import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./pages/Management/Categories/index";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/management/categories" element={<CategoryPage />} />
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
