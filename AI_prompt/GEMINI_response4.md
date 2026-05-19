Lỗi `npm error could not determine executable to run` khi chạy lệnh `npx tailwindcss init -p` xuất hiện vì trong các phiên bản mới của Tailwind CSS (như Tailwind v4), lệnh CLI đã được thay đổi cấu trúc, hoặc do `npx` bị xung đột cache local trên máy Mac của bạn.

Để không làm mất thời gian quý báu của bài test, bạn hãy xử lý nhanh bằng cách tự tạo tay 2 file cấu hình này trực tiếp trong VS Code hoặc Finder. Cách này hoàn toàn chuẩn cấu trúc và giúp bạn đi tiếp ngay lập tức.

---

## Bước 1: Tạo tay file `tailwind.config.js`

1. Tại thư mục `frontend`, bạn tạo một file mới tên chính xác là: **`tailwind.config.js`**
2. Dán toàn bộ đoạn mã cấu hình này vào file:

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

---

## Bước 2: Tạo tay file `postcss.config.js`

1. Cũng tại thư mục `frontend`, bạn tạo thêm một file nữa tên chính xác là: **`postcss.config.js`**
2. Dán đoạn mã này vào file:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Bước 3: Kích hoạt Tailwind hệ thống

Bây giờ bạn mở file **`frontend/src/index.css`** lên (bạn có thể xóa hết toàn bộ những đoạn code CSS mặc định có sẵn của Vite đi) và dán 3 dòng directive này vào ngay trên cùng:

```css
@tailwindcss base;
@tailwindcss components;
@tailwindcss utilities;
```

---

## Bước 4: Viết file logic Router và App chính (`src/App.tsx`)

Để kết nối tất cả các màn hình sắp code lại với nhau bằng `react-router-dom`, bạn mở file **`frontend/src/App.tsx`** ra, xóa hết code mặc định đi và cập nhật lại cấu trúc Router cốt lõi này:

```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// Định nghĩa tạm các component để app không bị crash khi chưa tạo file
const ProductList = () => <div className="p-8"><h2>Product List Screen (PC >= 1280px & Mobile)</h2></div>;
const ProductDetail = () => <div className="p-8"><h2>Product Detail Screen</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường công khai công cộng */}
        <Route path="/login" element={<Login />} />

        [cite_start]{/* Các tuyến đường được bảo vệ bởi Route Guard - Bắt buộc phải Login [cite: 26, 36] */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>

        {/* Mặc định nếu gõ sai route thì điều hướng về trang sản phẩm */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

```

---

Bạn tạo xong 2 file cấu hình Tailwind và cập nhật file `App.tsx` chưa? Nếu mọi thứ đã sẵn sàng và không báo lỗi compile, hãy bảo mình để chúng ta bắt tay vào viết code cho file **`src/pages/Login.tsx`** xử lý giao diện đăng nhập và gọi API `/api/login` nhé!
