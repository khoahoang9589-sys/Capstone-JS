import { Product } from "../model/Product.js";
import { Validation } from "../model/Validation.js";
import { CallApi } from "./callAPI.js";

const api = new CallApi();
const validation = new Validation();

let currentProductList = [];

// Hàm lấy danh sách sản phẩm và hiển thị lên bảng
function getProductList() {
  api.fetchProductList()
    .then((res) => {
      currentProductList = res.data;
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
        <td class="fw-bold text-primary">${product.id || ""}</td>
        <td><img src="${product.img}" width="50" height="50" style="object-fit:cover; border-radius: 4px;" onerror="this.src='https://placehold.co/50x50?text=SP'" /></td>
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
function getProductData(isEdit = false) {
  const id = document.getElementById("phoneId").value;
  const name = document.getElementById("phoneName").value;
  const price = document.getElementById("phonePrice").value;
  const type = document.getElementById("phoneType").value;
  const img = document.getElementById("phoneImg").value;
  const description = document.getElementById("phoneDesc").value;

  // Kiểm tra Validation
  let isValid = true;
  if (!isEdit) {
    isValid &= validation.checkEmpty(id, "tbPhoneId", "Mã sản phẩm không được để trống");
    if (id.trim() !== "") {
      isValid &= validation.checkDuplicateId(id, currentProductList, "tbPhoneId", "Mã sản phẩm đã tồn tại");
    }
  }
  isValid &= validation.checkEmpty(name, "tbPhoneName", "Tên không được để trống");
  isValid &= validation.checkPrice(price, "tbPhonePrice", "Giá phải là số lớn hơn 0");
  isValid &= validation.checkSelect("phoneType", "tbPhoneType", "Vui lòng chọn phân loại");
  isValid &= validation.checkEmpty(img, "tbPhoneImg", "Hình ảnh không được để trống");
  isValid &= validation.checkEmpty(description, "tbPhoneDesc", "Mô tả không được để trống");

  if (!isValid) return null;

  return new Product(id.trim(), name, price, img, description, type);
}

// Sự kiện bấm nút thêm mới trên giao diện
const btnThemSP = document.getElementById("btnThemSP");
if (btnThemSP) {
  btnThemSP.addEventListener("click", () => {
    const form = document.getElementById("productForm");
    if (form) form.reset();

    // Hiện ô nhập Mã sản phẩm (ID) khi Thêm mới
    const groupPhoneId = document.getElementById("groupPhoneId");
    if (groupPhoneId) groupPhoneId.classList.remove("d-none");

    document.getElementById("phoneId").value = "";
    document.getElementById("phoneId").disabled = false;
    document.getElementById("btnAddPhone").classList.remove("d-none");
    document.getElementById("btnUpdatePhone").classList.add("d-none");
    
    // Xóa các thông báo lỗi cũ
    ["tbPhoneId", "tbPhoneName", "tbPhonePrice", "tbPhoneType", "tbPhoneImg", "tbPhoneDesc"].forEach(id => {
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
    const product = getProductData(false);
    if (product) {
      api.addProduct(product)
        .then(() => {
          alert("Thêm sản phẩm thành công!");
          const modalEl = document.getElementById("productModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          getProductList();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data || "Có lỗi xảy ra khi thêm sản phẩm!");
        });
    }
  });
}

// Đưa dữ liệu lên form khi bấm nút Sửa
window.editProduct = function (id) {
  // Ẩn ô nhập Mã sản phẩm (ID) khi Sửa
  const groupPhoneId = document.getElementById("groupPhoneId");
  if (groupPhoneId) groupPhoneId.classList.add("d-none");

  document.getElementById("btnAddPhone").classList.add("d-none");
  document.getElementById("btnUpdatePhone").classList.remove("d-none");

  // Xóa các thông báo lỗi cũ
  ["tbPhoneId", "tbPhoneName", "tbPhonePrice", "tbPhoneType", "tbPhoneImg", "tbPhoneDesc"].forEach(spanId => {
    const el = document.getElementById(spanId);
    if (el) {
      el.innerHTML = "";
      el.style.display = "none";
    }
  });

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
    const product = getProductData(true);
    if (product) {
      api.updateProduct(product.id, product)
        .then(() => {
          alert("Cập nhật thành công!");
          const modalEl = document.getElementById("productModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
          getProductList();
        })
        .catch((err) => {
          console.log(err);
          alert(err.response?.data || "Có lỗi xảy ra khi cập nhật!");
        });
    }
  });
}

// Tìm kiếm sản phẩm theo tên hoặc mã SP
const txtSearch = document.getElementById("txtSearch");
if (txtSearch) {
  txtSearch.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filterList = currentProductList.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.id && String(item.id).toLowerCase().includes(keyword))
    );
    renderTable(filterList);
  });
}

// Sắp xếp sản phẩm theo giá
const sortPrice = document.getElementById("sortPrice");
if (sortPrice) {
  sortPrice.addEventListener("change", (e) => {
    const order = e.target.value;
    let list = [...currentProductList];
    if (order === "asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (order === "desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    renderTable(list);
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