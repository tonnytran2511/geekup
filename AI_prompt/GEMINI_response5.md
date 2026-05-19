Việc tạo tay các file cấu hình Tailwind và thiết lập luồng điều hướng trong `App.tsx` của bạn **hoàn toàn chính xác và chuẩn cấu trúc**. Bạn đã xử lý tình huống phát sinh rất nhanh để bảo vệ quỹ thời gian 24 giờ làm bài test.

Tuy nhiên, nếu bạn chạy ứng dụng ngay lúc này, project sẽ bị crash (báo lỗi compile) ở file `App.tsx` vì chúng ta **chưa tạo file cho 2 component**: `ProtectedRoute` và `Login`.

Để ứng dụng có thể khởi chạy mượt mà, chúng ta sẽ tiến hành tạo nhanh 2 file này.

---

## 1. Tạo file Màn hình Đăng nhập (`src/pages/Login.tsx`)

Màn hình này sử dụng một biểu mẫu nhập đơn giản gồm tên đăng nhập và mật khẩu theo đúng yêu cầu, đồng thời sử dụng hệ thống class của Tailwind CSS để căn chỉnh giao diện mượt mà.

Bạn tạo file `src/pages/Login.tsx` và dán đoạn code sau:

```tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Nhớ đảm bảo bạn đã tạo file axiosInstance trước đó nhé

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ Username và Password");
      return;
    }

    try {
      setLoading(true);
      [cite_start]; // Gọi endpoint /api/login bằng POST method [cite: 28]
      const response = await axiosInstance.post("/api/login", {
        username,
        password,
      });

      if (response.data && response.data.accessToken) {
        [cite_start]; // Lưu trữ các token thích hợp vào localStorage [cite: 28]
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken || "");

        // Nếu mock data của bạn có trả về trường user, lưu lại để hiển thị avatar lên Header
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }

        [cite_start]; // Chuyển hướng sang màn hình danh sách sản phẩm sau khi đăng nhập thành công [cite: 25, 29]
        navigate("/products");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Product Showcase
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Đăng nhập để trải nghiệm hệ thống
          </p>
        </div>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}
        [cite_start]{/* Form nhập username và password đơn giản [cite: 27] */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Nhập tên tài khoản bất kỳ..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-slate-400"
          >
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

---

## 2. Khởi chạy thử ứng dụng để kiểm tra kết quả Đăng nhập

Đảm bảo bạn vẫn đang bật Mockoon server chạy ngầm ở port `3001`. Quay lại terminal tại thư mục `frontend` và chạy lệnh kích hoạt Vite:

```bash
npm run dev

```

Bấm vào đường link local hiển thị trên terminal (thường là `http://localhost:5173`). Bạn sẽ thấy màn hình Đăng nhập hiện ra rất chỉn chu. Thử nhập một username bất kỳ rồi ấn Login, nếu trình duyệt tự động nhảy sang trang có dòng chữ _"Product List Screen"_ là logic liên kết token của bạn đã chạy hoàn hảo!

Bạn hãy triển khai nốt 2 file này nhé. Khi mọi thứ đã chạy trơn tru, chúng ta sẽ bắt tay vào phần cốt lõi của Frontend: **Xây dựng layout và xử lý logic kết hợp giữa Search và Filter cho 120 sản phẩm** tại màn hình `ProductList.tsx`!
