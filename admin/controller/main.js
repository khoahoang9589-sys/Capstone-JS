import { Product } from "../model/Product.js";
import { Validation } from "../model/Validation.js";
import { CallApi } from "./callAPI.js";

const api = new CallApi();
const validation = new Validation();

// Hàm lấy danh sách sản phẩm và hiển thị lên bảng
function getProductList() {
  api.fetchProductList()
    .then((res) => {
      renderTable(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

// Chạy hàm lấy dữ liệu khi vừa mở trang
getProductList();

// Render danh sách sản phẩm ra bảng HTML
function renderTable(data) {
  let content = "";
  data.forEach((product, index) => {
    content += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td><img src="${product.img}" width="50" height="50" style="object-fit:cover; border-radius: 4px;" /></td>
        <td class="fw-semibold">${product.name}</td>
        <td class="text-end">${Number(product.price).toLocaleString()} VNĐ</td>
        <td><span class="badge bg-secondary">${product.type}</span></td>
        <td>${product.description}</td>
        <td class="text-center">
          <button class="btn btn-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#productModal" onclick="editProduct('${product.id}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  const tblDanhSachSP = document.getElementById("tblDanhSachSP");
  if (tblDanhSachSP) {
    tblDanhSachSP.innerHTML = content;
  }
}

// Xóa sản phẩm
window.deleteProduct = function (id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    api.deleteProduct(id)
      .then(() => {
        alert("Xóa thành công!");
        getProductList();
      })
      .catch((err) => console.log(err));
  }
};

// Lấy thông tin từ form và validate
function getProductData() {
  const id = document.getElementById("phoneId").value;
  const name = document.getElementById("phoneName").value;
  const price = document.getElementById("phonePrice").value;
  const type = document.getElementById("phoneType").value;
  const img = document.getElementById("phoneImg").value;
  const description = document.getElementById("phoneDesc").value;

  // Kiểm tra Validation
  let isValid = true;
  isValid &= validation.checkEmpty(name, "tbPhoneName", "Tên không được để trống");
  isValid &= validation.checkPrice(price, "tbPhonePrice", "Giá phải là số lớn hơn 0");
  isValid &= validation.checkSelect("phoneType", "tbPhoneType", "Vui lòng chọn phân loại");
  isValid &= validation.checkEmpty(img, "tbPhoneImg", "Hình ảnh không được để trống");
  isValid &= validation.checkEmpty(description, "tbPhoneDesc", "Mô tả không được để trống");

  if (!isValid) return null;

  return new Product(id, name, price, img, description, type);
}

// Sự kiện bấm nút thêm mới trên giao diện
const btnThemSP = document.getElementById("btnThemSP");
if (btnThemSP) {
  btnThemSP.addEventListener("click", () => {
    const form = document.getElementById("productForm");
    if (form) form.reset();
    document.getElementById("phoneId").value = "";
    document.getElementById("phoneId").disabled = false;
    document.getElementById("btnAddPhone").classList.remove("d-none");
    document.getElementById("btnUpdatePhone").classList.add("d-none");
    
    // Xóa các thông báo lỗi cũ
    ["tbPhoneName", "tbPhonePrice", "tbPhoneType", "tbPhoneImg", "tbPhoneDesc"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = "";
        el.style.display = "none";
      }
    });
  });
}

// Thêm sản phẩm mới (Nút trong Modal)
const btnAddPhone = document.getElementById("btnAddPhone");
if (btnAddPhone) {
  btnAddPhone.addEventListener("click", (e) => {
    e.preventDefault();
    const product = getProductData();
    if (product) {
      api.addProduct(product)
        .then(() => {
          alert("Thêm sản phẩm thành công!");
          const modalEl = document.getElementById("productModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          getProductList();
        })
        .catch((err) => console.log(err));
    }
  });
}

// Đưa dữ liệu lên form khi bấm nút Sửa
window.editProduct = function (id) {
  document.getElementById("phoneId").disabled = true;
  document.getElementById("btnAddPhone").classList.add("d-none");
  document.getElementById("btnUpdatePhone").classList.remove("d-none");

  api.getProductById(id)
    .then((res) => {
      const p = res.data;
      document.getElementById("phoneId").value = p.id;
      document.getElementById("phoneName").value = p.name;
      document.getElementById("phonePrice").value = p.price;
      document.getElementById("phoneType").value = p.type;
      document.getElementById("phoneImg").value = p.img;
      document.getElementById("phoneDesc").value = p.description;
    })
    .catch((err) => console.log(err));
};

// Cập nhật sản phẩm
const btnUpdatePhone = document.getElementById("btnUpdatePhone");
if (btnUpdatePhone) {
  btnUpdatePhone.addEventListener("click", (e) => {
    e.preventDefault();
    const product = getProductData();
    if (product) {
      api.updateProduct(product.id, product)
        .then(() => {
          alert("Cập nhật thành công!");
          const modalEl = document.getElementById("productModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          getProductList();
        })
        .catch((err) => console.log(err));
    }
  });
}

// Tìm kiếm sản phẩm theo tên
const txtSearch = document.getElementById("txtSearch");
if (txtSearch) {
  txtSearch.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    api.fetchProductList()
      .then((res) => {
        const filterList = res.data.filter((item) => item.name.toLowerCase().includes(keyword));
        renderTable(filterList);
      })
      .catch((err) => console.log(err));
  });
}

// Sắp xếp sản phẩm theo giá
const sortPrice = document.getElementById("sortPrice");
if (sortPrice) {
  sortPrice.addEventListener("change", (e) => {
    const order = e.target.value;
    api.fetchProductList()
      .then((res) => {
        let list = res.data;
        if (order === "asc") {
          list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (order === "desc") {
          list.sort((a, b) => Number(b.price) - Number(a.price));
        }
        renderTable(list);
      })
      .catch((err) => console.log(err));
  });
}

// Nút tải lại / làm mới danh sách
const btnRefresh = document.getElementById("btnRefresh");
if (btnRefresh) {
  btnRefresh.addEventListener("click", () => {
    if (txtSearch) txtSearch.value = "";
    if (sortPrice) sortPrice.value = "default";
    getProductList();
  });
}