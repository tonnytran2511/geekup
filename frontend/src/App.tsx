import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import ProductList from "./pages/ProductList.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường công khai */}
        <Route path="/login" element={<Login />} />

        {/* Các tuyến đường bảo mật - Bắt buộc phải Login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* Mặc định điều hướng về trang danh sách sản phẩm */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
