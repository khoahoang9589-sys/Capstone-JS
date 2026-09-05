# Kế hoạch triển khai dự án Capstone JS: Phone-Shop (Website Bán Hàng & Quản Trị)

Dự án website bán lẻ điện thoại di động bao gồm hai phân hệ chính:
- **Trang Khách hàng (Customer / Storefront)**: Xem danh mục, lọc theo hãng (Apple, Samsung), giỏ hàng mua sắm (thêm, sửa, xóa, thanh toán), đồng bộ dữ liệu vào `localStorage` theo đúng Flowchart.
- **Trang Quản trị (Admin Dashboard)**: Quản lý sản phẩm (CRUD qua RESTful API bằng Axios), tìm kiếm theo tên, sắp xếp theo giá, kiểm tra validation form nhập liệu chặt chẽ.

Toàn bộ dự án tuân thủ mô hình **MVC** (Model - View - Controller - Services), tổ chức **Sass chuẩn 7-1**, đối tượng **OOP** theo đúng sơ đồ lớp và dữ liệu chuẩn từ CyberSoft.

---

## Cấu trúc thư mục dự án (Tổ chức Sass 7-1 & MVC)

```
Phone-Shop (Capstone-JS)/
├── .vscode/
├── admin/                           # Phân hệ Quản trị viên
│   ├── controller/
│   │   ├── main.js                  # Điều khiển CRUD, tìm kiếm, sắp xếp
│   │   └── validation.js            # Lớp xác thực form nhập liệu
│   ├── model/
│   │   └── Product.js               # Lớp đối tượng Product
│   ├── services/
│   │   └── productService.js        # Gọi API với Axios
│   └── view/
│       └── index.html               # Giao diện trang Admin Dashboard
├── asset/                           # Tài nguyên dùng chung cho nhiều trang
│   ├── css/
│   │   └── style.css                # CSS tổng hợp
│   ├── img/                         # Thư mục hình ảnh
│   │   └── .gitkeep
│   └── sass/                        # Tổ chức chuẩn Sass 7-1
│       ├── abstracts/
│       │   ├── _variables.scss      # Biến màu sắc, font, spacing
│       │   └── _mixins.scss         # Responsive breakpoints, flexbox mixin
│       ├── base/
│       │   ├── _reset.scss          # Reset CSS
│       │   └── _typography.scss     # Font chữ, tiêu đề, văn bản
│       ├── components/
│       │   ├── _buttons.scss        # Nút bấm
│       │   ├── _cards.scss          # Thẻ sản phẩm
│       │   ├── _modal.scss          # Modal thêm/sửa, dialog
│       │   └── _cart.scss           # Bảng giỏ hàng, badge
│       ├── layout/
│       │   ├── _header.scss         # Header, navbar
│       │   └── _footer.scss         # Chân trang
│       ├── pages/
│       │   ├── _customer.scss       # Style riêng trang bán hàng
│       │   └── _admin.scss          # Style riêng trang quản trị
│       ├── themes/
│       │   └── _theme.scss          # Chế độ màu sắc
│       ├── vendors/
│       │   └── _custom.scss         # Tùy biến thư viện ngoài (Bootstrap)
│       └── main.scss                # Tập tin gom import toàn bộ Sass
├── customer/                        # Phân hệ Khách hàng
│   ├── controller/
│   │   └── main.js                  # Điều khiển hiển thị sản phẩm, lọc, giỏ hàng
│   ├── model/
│   │   ├── CartItem.js              # Lớp CartItem (id, name, price, img, quantity)
│   │   └── Product.js               # Lớp Product
│   ├── services/
│   │   └── productService.js        # Gọi API lấy sản phẩm
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
- Gọi API lấy dữ liệu sản phẩm từ backend (`fetchProducts`).
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
- Sử dụng thư viện **Axios** trong `admin/services/productService.js`:
  - `fetchProducts()`: `GET /products` -> hiển thị danh sách sản phẩm lên bảng Table.
  - `fetchProductById(id)`: `GET /products/:id` -> lấy dữ liệu chi tiết của 1 sản phẩm.
  - `addProduct(product)`: `POST /products` -> tạo mới sản phẩm trên server.
  - `updateProduct(id, product)`: `PUT /products/:id` -> cập nhật thông tin sản phẩm.
  - `deleteProduct(id)`: `DELETE /products/:id` -> xóa sản phẩm khỏi server.
- Giao diện bảng danh sách sản phẩm quản trị:
  - Cột: STT, Tên sản phẩm, Giá, Hình ảnh, Mô tả, Hãng, Thao tác (Sửa / Xóa).
  - Nút "Thêm Sản Phẩm Mới": Mở modal form với các trường thông tin trống.
  - Nút "Sửa": Mở modal form, tự động điền thông tin cũ của sản phẩm để cập nhật.
  - Nút "Xóa": Hiển thị hộp thoại xác nhận trước khi gọi API xóa.

#### 2. Kiểm tra tính hợp lệ dữ liệu (Form Validation)
- Xây dựng lớp `Validation` (`admin/controller/validation.js`):
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
- **Tổ chức Sass 7-1**:
  - Thư mục `asset/sass/` đầy đủ 7 thư mục chuẩn.
  - `main.scss` biên dịch ra `asset/css/style.css` dùng chung.
  - Responsive hoàn chỉnh cho Mobile, Tablet và Desktop.

