Dưới đây là lộ trình từng bước (Step-by-Step) được thiết kế tối ưu để bạn hoàn thành xuất sắc thử thách này:

---

## BƯỚC 1: KHỞI ĐỘNG & THIẾT LẬP DECISION LOG

Vì đề bài bắt buộc phải có file `DECISION_LOG.md` ghi lại chi tiết quá trình làm bài theo từng mốc thời gian, bạn cần tạo file này ngay lập tức.

1. **Tạo cấu trúc thư mục dự án:**

```text
product-showcase-assessment/
├── DECISION_LOG.md
├── README.md
├── mockoon-data.json
├── docker-compose.yml
└── frontend/          <-- Nơi chứa code React/Next.js/Vue
```

2. **Mở file `DECISION_LOG.md`** và ghi lại mốc thời gian bắt đầu
3. > **Lưu ý cực kỳ quan trọng:** Cứ mỗi khi bạn chuẩn bị dùng AI (như hỏi Gemini/ChatGPT), hãy copy lại prompt và kết quả vào file này theo đúng template

---

## BƯỚC 2: THIẾT KẾ MOCK API VỚI MOCKOON

Đề bài yêu cầu dùng Mockoon và chuẩn bị data cho **ít nhất 100 sản phẩm**. Bạn nên làm phần này trước để có dữ liệu mock chuẩn cho Frontend.

1.  **Tải và cài đặt Mockoon** (hoặc dùng bản CLI nếu quen).
2.  **Tạo các Endpoint sau:**

- `POST /api/login`: Trả về mock token (access token, refresh token).
- `POST /api/logout`: Trả về success message.
- `GET /api/product`: Trả về mảng chứa ít nhất 100 object sản phẩm. Dùng tính năng _Templating_ của Mockoon hoặc công cụ như Faker để sinh data gồm: `id`, `name`, `image` (dùng link từ DiceBear hoặc UI-Avatars), `description`, và các thuộc tính khác (giá, danh mục...) để phục vụ tính năng filter.
- `GET /api/product/:id`: Trả về chi tiết của 1 sản phẩm dựa theo ID.

3.  **Export data:** Xuất file cấu hình ra thành `mockoon-data.json` và lưu ở thư mục gốc.

---

## BƯỚC 3: KHỞI TẠO VÀ BUILD GIAO DIỆN FRONTEND

Bạn nên chọn **React (Vite)** hoặc **Next.js** kết hợp với một UI Library như **Ant Design** hoặc **Tailwind CSS** để tối ưu hóa tốc độ code.

1. **Khởi tạo:** Di chuyển vào thư mục `frontend/` và khởi tạo project (ví dụ: `npm create vite@latest . -- --template react-ts`).
2. **Cài đặt thư viện:** Cài đặt các thư viện cần thiết như `axios` (hoặc `fetch`), `react-router-dom` (để chuyển trang), và UI framework bạn chọn.
3. **Xây dựng các màn hình chính:**

- **Layout chung:** Đảm bảo Responsive tốt trên PC ($\ge$ 1280px) và Mobile ($<$ 1280px).
- **Login Screen:** Form đơn giản (Username/Password), gọi `/api/login`, lưu token vào `localStorage`/`cookie` và chuyển hướng. Nhớ chặn không cho vào các trang trong nếu chưa login (Route Guard).
- **Product List Screen:** \* Fetch dữ liệu từ `/api/product`.
- Hiển thị danh sách (Grid/List layout) đầy đủ tên, ảnh, mô tả và nút "View Detail".
- **Tính năng Search:** Tìm kiếm theo tên.
- **Tính năng Filter:** Lọc theo tất cả các dữ liệu sản phẩm (ví dụ: lọc theo khoảng giá, theo danh mục...). _Mẹo: Nếu Mockoon không hỗ trợ filter động ở backend tốt, bạn có thể fetch toàn bộ 100+ sản phẩm về và thực hiện filter/search ở client-side._
- **Product Detail Screen:** Fetch dữ liệu từ `/api/product/[id]` khi bấm vào nút xem chi tiết và hiển thị.
- **Logout Feature:** Nút đăng xuất gọi `/api/logout`, xóa sạch token ở client và đá người dùng về trang login.

---

## BƯỚC 4: CONTAINERIZATION VỚI DOCKER (Thời gian dự kiến: 1.5 - 2 tiếng)

Đây là điểm mấu chốt để bài test chạy mượt mà trên máy của người chấm.

1.  **Viết `Dockerfile` bên trong thư mục `frontend/`**:

- Sử dụng multi-stage build (Stage 1: Build source code bằng Node.js; Stage 2: Dùng Nginx để phục vụ các file tĩnh sau khi build).

2.  **Viết `docker-compose.yml` ở thư mục gốc**:

- Cấu hình dịch vụ `frontend` map với Dockerfile vừa tạo.

- Cấu hình dịch vụ `mock-api` sử dụng image `mockoon/cli`, mount file `mockoon-data.json` vào container và chạy lệnh để load file này.

- **Lưu ý giao tiếp:** Đảm bảo cấu hình biến môi trường (`ENV`) của Frontend trỏ URL API về tên dịch vụ `http://mock-api:port` hoặc expose port của `mock-api` ra ngoài máy host (ví dụ `http://localhost:3000`) để Frontend ở trình duyệt gọi được.

3.  **Chạy thử:** Chạy lệnh `docker-compose up --build` để kiểm tra xem toàn bộ hệ thống gồm Frontend và Mock API có hoạt động trơn tru với nhau không.

---

## BƯỚC 5: HOÀN THIỆN TÀI LIỆU & ĐÓNG GÓI BÀI TEST (Thời gian dự kiến: 1 tiếng)

1.  **Kiểm tra chất lượng code:** Rà soát lại code để đảm bảo cấu trúc rõ ràng, đặt tên biến dễ hiểu và không bị sai lỗi chính tả.

2.  **Chụp ảnh minh chứng:** Chụp lại các màn hình kết quả đang chạy thành công (Login, List, Detail, Filter/Search, Docker đang chạy).

3.  **Viết `README.md**`:

- Hướng dẫn cụ thể từng bước để cài đặt và khởi chạy dự án (Ví dụ: Các lệnh cần chạy như `docker-compose up`).

4.  **Viết file mô tả tiếp cận (ví dụ `APPROACH.txt` hoặc bổ sung vào README)**:

- Liệt kê các thư viện/công cụ bạn đã chọn (React, AntD, Axios...) và lý do bạn chọn chúng.

5. **Đóng gói bài làm:**

- Đảm bảo file `DECISION_LOG.md` đã được cập nhật đầy đủ đến bước cuối cùng.

- Nén toàn bộ mã nguồn thành file `.zip` (Nhớ **loại bỏ** các thư mục nặng như `node_modules`, `.git`, các thư mục build như `dist` hay `build`).

- Gom file zip, các ảnh chụp màn hình, file mockoon vào 1 folder chung trên Google Drive hoặc nền tảng lưu trữ theo yêu cầu, rồi gửi link qua cho HR.

---
