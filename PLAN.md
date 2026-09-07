# Kế hoạch triển khai dự án Capstone JS: Phone-Shop (Website Bán Hàng & Quản Trị)

Dự án website bán lẻ điện thoại di động bao gồm hai phân hệ chính:
- **Trang Khách hàng (Customer / Storefront)**: Xem danh mục, lọc theo hãng (Apple, Samsung), giỏ hàng mua sắm (thêm, sửa, xóa, thanh toán), đồng bộ dữ liệu vào `localStorage` theo đúng Flowchart.
- **Trang Quản trị (Admin Dashboard)**: Quản lý sản phẩm (CRUD qua RESTful API bằng Axios), tìm kiếm theo tên, sắp xếp theo giá, kiểm tra validation form nhập liệu chặt chẽ.

Toàn bộ dự án tuân thủ mô hình **MVC** (Model - View - Controller), sử dụng **SASS đơn giản** (`asset/sass/`) biên dịch ra `asset/css/style.css` kết hợp **Bootstrap 5.3**, đối tượng **OOP** theo đúng sơ đồ lớp và dữ liệu chuẩn từ CyberSoft.

---

## Cấu trúc thư mục dự án (Chuẩn MVC & SASS đơn giản)

```
Phone-Shop (Capstone-JS)/
├── .vscode/
│   └── settings.json                # Cấu hình tự động biên dịch SASS
├── admin/                           # Phân hệ Quản trị viên
│   ├── controller/
│   │   ├── callAPI.js               # Gọi API với Axios
│   │   └── main.js                  # Điều khiển CRUD, tìm kiếm, sắp xếp
│   ├── model/
│   │   ├── Product.js               # Lớp đối tượng Product
│   │   └── Validation.js            # Lớp xác thực form nhập liệu
│   └── view/
│       └── index.html               # Giao diện trang Admin Dashboard
├── asset/                           # Tài nguyên dùng chung cho 2 trang
│   ├── css/
│   │   └── style.css                # CSS tổng hợp (biên dịch từ SASS)
│   ├── img/                         # Thư mục hình ảnh
│   └── sass/                        # SASS đơn giản, dễ quản lý
│       ├── _variables.scss          # Biến màu sắc, font chữ, shadow
│       ├── _base.scss               # Cài đặt nền tảng, typography, body
│       ├── _customer.scss           # Style riêng trang Gian hàng (Card, Giỏ hàng)
│       ├── _admin.scss              # Style riêng trang Quản trị (Table, Validation)
│       └── main.scss                # File SASS chính gom import các file trên
├── customer/                        # Phân hệ Khách hàng
│   ├── controller/
│   │   ├── callAPI.js               # Gọi API lấy danh sách sản phẩm
│   │   └── main.js                  # Điều khiển hiển thị sản phẩm, lọc, giỏ hàng
│   ├── model/
│   │   ├── CartItem.js              # Lớp CartItem
│   │   └── Product.js               # Lớp Product
│   └── view/
│       └── index.html               # Giao diện trang bán hàng customer
├── data-backup.json                 # Dữ liệu mẫu chuẩn CyberSoft
├── index.html                       # Trang chủ bán hàng (Customer) với menu chuyển sang Admin
├── PLAN.md                          # Kế hoạch chi tiết của dự án
└── README.md
```

---

## Chi tiết kế hoạch triển khai

### PHẦN 1: WEBSITE BÁN HÀNG (CUSTOMER)

#### 1. Dữ liệu & Lớp đối tượng (OOP)
- **Lớp `Product`** (`customer/model/Product.js`):
  - Thuộc tính: `id`, `name`, `price`, `screen`, `backCamera`, `frontCamera`, `img`, `desc`, `type`.
- **Lớp `CartItem`** (`customer/model/CartItem.js` theo đúng sơ đồ lớp gợi ý):
  - Thuộc tính: `id`, `name`, `price`, `img`, `quantity`.
  - Phương thức `calcTotal()`: `price * quantity`.
- **Quản lý Giỏ hàng**:
  - Mảng toàn cục `cart` chứa các đối tượng `CartItem`.
  - Các hàm tiện ích: `themGH(sp)`, `timViTri(id)`, `xoaGH(id)`, `capNhatSoLuong(id, soLuong)`, `tinhTongTien()`.

#### 2. Hiển thị danh sách sản phẩm & Bộ lọc
- Gọi API lấy dữ liệu sản phẩm từ backend (`callAPI.js`).
- Viết hàm `renderProducts(list)`:
  - Tạo các thẻ `<div>` card sản phẩm chuẩn Bootstrap Grid (ảnh, tên, giá tiền, thông số màn hình, camera trước/sau, mô tả, nút "Thêm vào giỏ").
- Bộ lọc loại sản phẩm (Dropdown Select):
  - Sự kiện `onchange` trên thẻ select.
  - Các tùy chọn: "Tất cả", "Samsung", "iPhone".
  - Xử lý không phân biệt hoa thường (`type.toLowerCase() === selectedType.toLowerCase()`).
  - Lọc mảng và gọi lại `renderProducts()` để cập nhật UI ngay lập tức.

#### 3. Giỏ hàng & LocalStorage theo Flowchart
- **Thêm vào giỏ hàng**:
  - Khi người dùng nhấn "Thêm vào giỏ", kiểm tra sản phẩm đã có trong mảng `cart` chưa qua `id`.
  - Nếu chưa có: tạo đối tượng `CartItem` mới với `quantity = 1` và `push` vào mảng `cart`.
  - Nếu đã có: tăng `quantity` lên 1 đơn vị.
- **Hiển thị giỏ hàng (`renderCart`)**:
  - Duyệt mảng `cart`, sinh mã HTML các thẻ `<tr>` trong bảng table giỏ hàng:
    - Hình ảnh thu nhỏ, tên sản phẩm, giá đơn vị.
    - Bộ điều chỉnh số lượng: Nút `[-]`, ô số lượng, nút `[+]`.
    - Thành tiền (`price * quantity`).
    - Nút `[Xóa]` (thùng rác).
  - Cập nhật tổng tiền đơn hàng (`tinhTongTien()`).
  - Cập nhật số lượng trên Badge giỏ hàng ở Header Navbar.
- **Tăng / Giảm số lượng & Xóa**:
  - Nút `[+]`: tăng `quantity + 1`.
  - Nút `[-]`: giảm `quantity - 1`. Nếu `quantity === 0`, hỏi xác nhận xóa hoặc xóa khỏi giỏ.
  - Nút `[Xóa]`: gỡ bỏ item khỏi mảng `cart`.
- **Lưu trữ LocalStorage**:
  - Tải trang (On Load): Đọc `localStorage.getItem("CART_LIST")`. Nếu khác `null`, parse JSON nạp vào `cart` và render giỏ hàng.
  - Mọi thao tác Thêm, Sửa số lượng, Xóa đều tự động lưu `localStorage.setItem("CART_LIST", JSON.stringify(cart))`.
- **Thanh toán (Checkout)**:
  - Nhấn nút "Thanh toán": Thông báo đặt hàng thành công, xóa sạch mảng `cart = []`, làm mới `localStorage`, cập nhật lại giao diện giỏ hàng về trạng thái rỗng.

---

### PHẦN 2: TRANG QUẢN TRỊ (ADMIN DASHBOARD)

#### 1. Gọi API với Axios & Nghiệp vụ CRUD
- Sử dụng thư viện **Axios** trong `admin/controller/callAPI.js`:
  - `fetchProducts()`: `GET /products` -> hiển thị danh sách sản phẩm lên bảng Table.
  - `fetchProductById(id)`: `GET /products/:id` -> lấy dữ liệu chi tiết của 1 sản phẩm.
  - `addProduct(product)`: `POST /products` -> tạo mới sản phẩm trên server.
  - `updateProduct(id, product)`: `PUT /products/:id` -> cập nhật thông tin sản phẩm.
  - `deleteProduct(id)`: `DELETE /products/:id` -> xóa sản phẩm khỏi server.
- Giao diện bảng danh sách sản phẩm quản trị:
  - Cột: STT, Tên sản phẩm, Giá, Hình ảnh, Màn hình, Camera, Hãng, Mô tả, Thao tác (Sửa / Xóa).
  - Nút "Thêm Sản Phẩm Mới": Mở modal form với các trường thông tin trống.
  - Nút "Sửa": Mở modal form, tự động điền thông tin cũ của sản phẩm để cập nhật.
  - Nút "Xóa": Hiển thị hộp thoại xác nhận trước khi gọi API xóa.

#### 2. Kiểm tra tính hợp lệ dữ liệu (Form Validation)
- Xây dựng lớp `Validation` (`admin/model/Validation.js`):
  - `checkEmpty(value, spanId, message)`: Bắt buộc nhập không được để trống.
  - `checkPrice(value, spanId, message)`: Giá phải là số và lớn hơn 0.
  - `checkImageUrl(value, spanId, message)`: Link ảnh phải là URL hợp lệ.
  - `checkType(value, spanId, message)`: Bắt buộc chọn loại sản phẩm (`iphone` hoặc `samsung`).
- Thông báo lỗi hiển thị bằng thẻ `<span class="sp-thongbao text-danger small">` ngay dưới mỗi input.

#### 3. Tìm kiếm sản phẩm theo tên
- Ô input tìm kiếm (Search box):
  - Bắt sự kiện `input` hoặc `keyup`.
  - Tìm kiếm không phân biệt chữ hoa/chữ thường (`toLowerCase()`, `includes()`).
  - Lọc mảng sản phẩm và render lại bảng table ngay tức thì.

#### 4. Sắp xếp sản phẩm theo giá tiền
- Thẻ select sắp xếp:
  - Giá tăng dần (từ thấp đến cao).
  - Giá giảm dần (từ cao đến thấp).
  - Mặc định (theo thứ tự ban đầu).

---

### PHẦN 3: ĐIỀU HƯỚNG & GIAO DIỆN CHUNG

- **Tập tin `index.html` (Thư mục gốc)**:
  - Trang chủ Khách hàng (Customer Store) trực tiếp.
  - Trên Navbar có mục **"Quản trị (Admin)"**, click chuyển sang `./admin/view/index.html`.
  - Trên trang Admin có nút **"Về trang bán hàng"** chuyển ngược về `../../index.html`.
- **Tổ chức SASS đơn giản**:
  - `asset/sass/` gồm các file `_variables.scss`, `_base.scss`, `_customer.scss`, `_admin.scss` và `main.scss`.
  - Biên dịch tự động ra `asset/css/style.css` thông qua extension Live Sass Compiler hoặc `npx sass`.
  - Responsive hoàn chỉnh cho Mobile, Tablet và Desktop.
