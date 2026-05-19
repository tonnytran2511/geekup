Chúc mừng bạn đã hoàn thành xuất sắc chặng đầu tiên và có được file `mockoon-data.json` chuẩn chỉnh!

Bây giờ chúng ta sẽ bước sang **Bước 3: Khởi tạo và code giao diện Frontend**. Mình sẽ hướng dẫn bạn chuẩn bị môi trường và cấu hình các file nền tảng trước để hệ thống chạy thật trơn tru.

---

## 1. Khởi tạo Dự án Frontend (React + TypeScript)

Bạn mở Terminal của máy tính lên, di chuyển vào thư mục gốc của dự án (nơi bạn vừa lưu file `mockoon-data.json`) và chạy các lệnh sau:

```bash
# 1. Khởi tạo một dự án React sử dụng Vite và TypeScript đặt tên là frontend
npm create vite@latest frontend -- --template react-ts

# 2. Di chuyển thẳng vào thư mục frontend vừa tạo
cd frontend

# 3. Cài đặt các thư viện bắt buộc cho Routing (chuyển trang) và Axios (gọi API)
npm install react-router-dom axios

# 4. Cài đặt Tailwind CSS để làm giao diện nhanh và responsive tốt
npm install -D tailwindcss postcss autoprefixer

# 5. Khởi tạo file cấu hình cho Tailwind CSS
npx tailwindcss init -p

```

---

## 2. Cấu hình Tailwind CSS

Để giao diện nhận được các class CSS từ Tailwind, bạn hãy mở file **`frontend/tailwind.config.js`** ra và cập nhật lại thuộc tính `content` như sau:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Tiếp theo, bạn mở file **`frontend/src/index.css`**, **xóa sạch toàn bộ code mặc định** của Vite đi và dán 3 dòng khai báo của Tailwind này vào:

```css
@tailwindcss base;
@tailwindcss components;
@tailwindcss utilities;

body {
  margin: 0;
  background-color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}
```

---

## 3. Cấu hình Axios Instance kết nối Mock API

Tạo một file mới tại đường dẫn **`frontend/src/api/axiosInstance.ts`**. File này sẽ giúp bạn gom cấu hình gọi API về một mối và tự động đính kèm token vào header sau khi login thành công.

```typescript
import axios from "axios";

// Khi chạy Docker compose, cổng của mock-api bên ngoài máy host sẽ là 3001
const API_BASE_URL = "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tự động lấy accessToken từ localStorage đính vào Header mỗi khi gọi API
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
```

---

## 4. Tạo Route Guard (Bảo vệ các tuyến đường công khai)

Để đảm bảo người dùng chưa đăng nhập thì không thể tự ý vào xem trang sản phẩm, chúng ta cần một component chặn lại.
Bạn tạo file **`frontend/src/components/ProtectedRoute.tsx`**:

```typescript
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra xem trong localStorage đã có accessToken chưa
  const isAuthenticated = !!localStorage.getItem('accessToken');

  // Nếu có thì cho đi tiếp vào các trang trong (Outlet), nếu chưa thì đá về trang login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

```

---

Môi trường và cấu hình lõi của Frontend đã sẵn sàng 100%! Bạn đã chạy xong các lệnh cài đặt ở trên và tạo các file này chưa? Nếu xong rồi thì báo mình để chúng ta cùng sang đoạn code **Giao diện trang Login** và xử lý logic gọi API lưu token nhé!
