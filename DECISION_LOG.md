# Technical Decision & Troubleshooting Log

Tài liệu này ghi nhận lại các vấn đề kỹ thuật phát sinh trong quá trình xây dựng hệ thống **Product Showcase**, cùng quy trình phối hợp xử lý lỗi thực tế giữa bản thân và các công cụ trợ lý AI (Gemini / Trae) để đưa dự án về trạng thái vận hành ổn định.

---

## 1. Xử lý xung đột môi trường CLI khi thiết lập Tailwind CSS

- **Tình huống:** Khi khởi tạo cấu hình giao diện tại thư mục Frontend bằng lệnh `npx tailwindcss init -p`, hệ thống CLI của Node trả về mã lỗi xung đột `npm error could not determine executable to run` và không thể tự động tạo file.
- **Prompt:** Copy lỗi từ terminal và gửi prompt tham vấn **Gemini**.
- **Kết quả AI trả về:** Chủ động khởi tạo thủ công hai tệp cấu hình bằng tay thay vì phụ thuộc vào CLI tự động.
- **Kết quả:** Đã tạo tay tệp `tailwind.config.js` và `postcss.config.js` tại thư mục định tuyến, nạp cấu hình quét phân vùng content cấu trúc cho thư mục `src/`. Trình biên dịch Vite sau đó đã nhận diện chính xác các class và dọn sạch lỗi biên dịch.

---

## 2. Giải quyết lỗi quy tắc ESLint kiểm soát dữ liệu (`no-explicit-any`)

- **Tình huống:** Tại khối xử lý ngoại lệ `catch (err: any)` của luồng Đăng nhập (`Login.tsx`) và Chi tiết sản phẩm (`ProductDetail.tsx`), bộ quét code nghiêm ngặt của dự án (ESLint) báo lỗi đỏ liên tục vì vi phạm quy chuẩn cấm sử dụng kiểu dữ liệu `any` tường minh (`eslint(@typescript-eslint/no-explicit-any)`).
- **Prompt:** Chụp màn hình dòng code bị gạch đỏ kèm lỗi linter gửi prompt tham vấn **Gemini / Trae**.
- **Kết quả AI trả về:** Thay đổi kiểu dữ liệu của biến ngoại lệ từ `any` sang `unknown`, sau đó áp dụng cú pháp ép kiểu nội dòng (inline type casting) cục bộ để thỏa mãn linter mà không làm hỏng logic cũ.
- **Kết quả:** Chỉnh sửa cấu trúc thành `catch (err: unknown)` và áp dụng đoạn mã ép kiểu: `(err as { response?: { data?: { message?: string } } }).response?.data?.message`. Toàn bộ các file sạch bóng lỗi đỏ trên IDE và vượt qua vòng quét kiểm thử.

---

## 3. Tối ưu hóa hiệu năng bộ lọc và dọn sạch cảnh báo React Hooks

- **Tình huống:** Khi xây dựng màn hình Danh sách sản phẩm (`ProductList.tsx`), việc đặt logic lọc 120 sản phẩm bên trong hook `useEffect` ban đầu dẫn đến cảnh báo gạch vàng `react-hooks/exhaustive-deps` trên IDE do thiếu mảng phụ thuộc, nhưng nếu thêm vào theo gợi ý thông thường thì ứng dụng sẽ bị lặp vô hạn (Infinite Loop).
- **Prompt:** Gửi file code `ProductList.tsx` lên **Gemini** để tham vấn cách dọn sạch cảnh báo vàng mà không làm crash ứng dụng.
- **Kết quả AI trả về:** Gỡ bỏ hoàn toàn logic lọc ra khỏi `useEffect` và chuyển dịch cấu trúc tính toán sang sử dụng hook **`useMemo`** để quản lý mảng dữ liệu đầu ra một cách độc lập.
- **Kết quả:** Áp dụng cấu trúc block `useMemo(() => { ... }, [searchQuery, filters, products])` thay thế cho logic cũ. Ứng dụng dọn sạch hoàn toàn các dòng gạch chân cảnh báo trên IDE, đồng thời tối ưu hóa tốc độ phản hồi của thanh tìm kiếm và bộ lọc đối với tập dữ liệu lớn.

---

## 4. Khắc phục sự cố cô lập mạng Orchestration trên Docker macOS

- **Tình huống:** Kích hoạt cụm Service thông qua lệnh `docker compose up --build`, hệ thống báo các container đều chạy thành công (`started`) nhưng trình duyệt Safari trên máy Mac hoàn toàn bị chặn và báo lỗi mất kết nối `Can't Connect to the Server` tại địa chỉ `http://localhost:5173`.
- **Prompt:** Copy toàn bộ log vận hành ở terminal kết hợp chụp màn hình lỗi trình duyệt gửi cho **Gemini** để gỡ lỗi.
- **Kết quả AI trả về:** Phát hiện thuộc tính ngữ cảnh `context` build trong file `docker-compose.yml` đang bị trỏ sai vị trí phân cấp thư mục gốc, dẫn đến việc container máy chủ Nginx bị mất tệp cấu hình mạng `nginx.conf`. Chỉ dẫn hạ container, sửa lại đường dẫn và ép build lại từ đầu bằng cờ xóa bộ nhớ đệm.
- **Kết quả:** Thực hiện theo chỉ dẫn: Hạ container bằng `docker compose down`, sửa trường cấu hình thành `context: ./frontend`, và kích hoạt lại bằng lệnh `docker compose build --no-cache && docker compose up`. Trình duyệt Safari sau đó đã kết nối mượt mà đến giao diện Front-end và gọi dữ liệu API trơn tru từ container Mockoon CLI ngầm (port 3001).
