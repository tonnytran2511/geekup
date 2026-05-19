Dưới đây là hướng dẫn chi tiết từng bước để bạn hoàn thành **Bước 2: Thiết kế Mock API với Mockoon**. Vì bạn cần chuẩn bị dữ liệu cho **ít nhất 100 sản phẩm**, việc nhập tay là bất khả thi. Chúng ta sẽ tận dụng tính năng **Templating (hỗ trợ cú pháp Handlebars và Faker.js)** tích hợp sẵn của Mockoon để sinh dữ liệu tự động.

---

## 1. Cài đặt và Khởi tạo Môi trường Mockoon

1. **Tải Mockoon:** Nếu chưa có, bạn tải bản Desktop tại [mockoon.com](https://mockoon.com).
2. **Tạo Môi trường mới (Environment):**

- Mở Mockoon, nhấn vào biểu tượng **`+` (New environment)** ở góc trên bên trái.
- Đặt tên môi trường là `Product Showcase API`.
- Cấu hình **Port** là `3000` (hoặc port bất kỳ bạn muốn, ví dụ `5000`, nhưng nhớ ghi lại để cấu hình Docker sau này).

---

## 2. Cấu hình chi tiết các Endpoint

Bạn cần tạo tổng cộng 4 route chính trong Mockoon. Nhấp vào nút **`+ Route`** ở cột giữa để tạo từng route:

Route 1: Đăng nhập (`POST /api/login`)

- **Method:** `POST`
- **Path:** `api/login`
- **Response Status:** `200 OK`
- **Body (chọn kiểu JSON):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "mock-jwt-access-token-xyz123",
  "refreshToken": "mock-jwt-refresh-token-abc456"
}
```

Route 2: Đăng xuất (`POST /api/logout`)

- **Method:** `POST`
- **Path:** `api/logout`
- **Response Status:** `200 OK`
- **Body (JSON):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Route 3: Danh sách sản phẩm (`GET /api/product`)

Đây là phần quan trọng nhất. Đề bài yêu cầu **ít nhất 100 sản phẩm**, có đủ **tên, ảnh (dùng link DiceBear/UI-Avatars), mô tả, và các trường để filter**.

- **Method:** `GET`
- **Path:** `api/product`
- **Response Status:** `200 OK`
- **Body (JSON):** Thay vì paste 100 object, bạn copy đoạn code Templating dưới đây vào phần **Body** của Mockoon. Công cụ này sẽ tự động sinh ra đúng 105 sản phẩm ngẫu nhiên khi Frontend gọi API:

```json
[
  {{# repeat 105 }}
  {
    "id": "{{ @index }}",
    "name": "{{ faker 'commerce.productName' }}",
    "image": "https://img.buymeacoffee.com/button-api/?text=Product+{{ @index }}&emoji=📦&slug=geekup&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff",
    "description": "{{ faker 'commerce.productDescription' }}",
    "price": {{ faker 'number.int' min=10 max=1000 }},
    "category": "{{ faker 'helpers.arrayElement' (array 'Electronics' 'Clothing' 'Books' 'Home & Kitchen' 'Sports') }}",
    "rating": {{ faker 'number.float' min=1 max=5 fractionDigits=1 }},
    "inStock": {{ faker 'datatype.boolean' }}
  }
  {{/ repeat }}
]

```

> **Giải thích kỹ thuật:** > \* `{{# repeat 105 }}`: Vòng lặp tạo ra 105 item.
>
> - `{{ @index }}`: Tự động tăng ID từ 0 đến 104.
> - `faker 'commerce.productName'`: Sinh tên sản phẩm ngẫu nhiên tiếng Anh.
> - `image`: Tạo link ảnh placeholder trực quan. Bạn có thể thay bằng link DiceBear nếu muốn: `https://api.dicebear.com/7.x/identicon/svg?seed={{ @index }}`.
> - `price`, `category`, `inStock`: Các trường dữ liệu bổ sung cực kỳ cần thiết để bạn làm tính năng **Filter** ở trang danh sách theo đúng yêu cầu đề bài.

Route 4: Chi tiết sản phẩm (`GET /api/product/:id`)

Để khi user bấm "View Detail", frontend truyền ID nào lên thì backend trả về đúng thông tin của sản phẩm đó.

- **Method:** `GET`
- **Path:** `api/product/:id` (Sử dụng dấu `:` để định nghĩa param động)

- **Response Status:** `200 OK`
- **Body (JSON):** Sử dụng cú pháp lấy `id` từ request param để render dữ liệu tương ứng:

```json
{
  "id": "{{ urlParam 'id' }}",
  "name": "Product {{ urlParam 'id' }} - {{ faker 'commerce.productName' }}",
  "image": "https://img.buymeacoffee.com/button-api/?text=Product+{{ urlParam 'id' }}&emoji=📦&slug=geekup&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff",
  "description": "Detailed description for product {{ urlParam 'id' }}. {{ faker 'commerce.productDescription' }}",
  "price": {{ faker 'number.int' min=10 max=1000 }},
  "category": "{{ faker 'helpers.arrayElement' (array 'Electronics' 'Clothing' 'Books' 'Home & Kitchen' 'Sports') }}",
  "rating": {{ faker 'number.float' min=1 max=5 fractionDigits=1 }},
  "inStock": {{ faker 'datatype.boolean' }},
  "specifications": {
    "brand": "{{ faker 'company.name' }}",
    "warranty": "12 months",
    "origin": "{{ faker 'location.country' }}"
  }
}

```

---

## 3. Cấu hình CORS (Bắt buộc để Frontend gọi được API)

Nếu bạn không bật CORS, khi chạy ứng dụng React/Vue ở port khác (ví dụ `localhost:5173`), trình duyệt sẽ chặn không cho gọi tới Mockoon (`localhost:3000`).

1. Ở cột bên trái, chọn biểu tượng **Gear (Environment Settings)** của môi trường bạn đang làm việc.
2. Tìm tab **Headers**.
3. Thêm các header sau (Mockoon thường đã tự động bật sẵn, bạn chỉ cần kiểm tra lại):

- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Headers`: `Origin, X-Requested-With, Content-Type, Accept, Authorization`
- `Access-Control-Allow-Methods`: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

---

## 4. Chạy thử và Xuất file cấu hình

1. **Chạy Mock server:** Nhấn vào nút **Play (Mũi tên xanh)** ở góc trên cùng bên trái giao diện Mockoon để kích hoạt API server.
2. **Test thử bằng Browser hoặc Postman:** \* Truy cập `http://localhost:3000/api/product`. Nếu thấy trình duyệt trả về một mảng JSON dài chứa hơn 100 sản phẩm với dữ liệu thay đổi ngẫu nhiên mỗi lần refresh là bạn đã thành công!

3. **Export file dữ liệu (Quan trọng nhất):**

- Vào menu **File** $\rightarrow$ **Export** $\rightarrow$ **Mockoon's environment(s) to a file (JSON)**.
- Chọn đúng môi trường vừa làm và lưu file với tên chính xác là **`mockoon-data.json`**.

- Di chuyển file này vào thư mục gốc của dự án của bạn (nơi sẽ chứa file `docker-compose.yml` sau này).

---

> 💡 **Đừng quên cập nhật Decision Log:** > Mở file `DECISION_LOG.md` lên và ghi lại:
>
> - `[Thời gian] - Thiết kế Mock API với Mockoon.` \* _Tình huống:_ Cần tạo 100+ data sản phẩm để filter.
> - _Giải pháp:_ Dùng tính năng `{{# repeat }}` và `faker` của Mockoon để tự động sinh dữ liệu thay vì nhập tay, giúp tiết kiệm thời gian làm Frontend.

Bạn đã chuẩn bị xong phần "xương sườn" dữ liệu cho hệ thống. Bạn có muốn chuyển sang **Bước 3: Khởi tạo cấu trúc Frontend** và xử lý logic kết nối tới các endpoint này không?
