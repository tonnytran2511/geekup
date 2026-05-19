import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Kiểm tra trạng thái lưu trữ token thích hợp trong localStorage [cite: 28]
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Nếu đã đăng nhập thì cho đi tiếp vào các route con (Outlet), ngược lại đá về trang login [cite: 26]
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
