import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/Login";
import ProductManager from "./component/ProductManager";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/products"
        element={token ? <ProductManager /> : <Navigate to="/login" />}
      />

      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
