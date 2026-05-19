import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">Product Showcase</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-slate-600 hidden sm:block">
                  {user.username}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
