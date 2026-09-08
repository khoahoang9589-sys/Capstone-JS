import { Cart, CartItem } from "../model/CartItem.js";
import { getAll } from "../controller/callAPI.js";

const cart = new Cart();

let listPD = [];

let showproduct = (productlist) => {
  let contentTb = "";
  productlist.map((pd, index) => {
    let divPD = `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card h-100 shadow-sm border-0">
          <div class="card-img-wrap position-relative text-center p-3 bg-light rounded-top">
            <span class="badge bg-secondary position-absolute top-0 start-0 m-2 text-uppercase">
              ${pd.type}
            </span>
            <img 
              src="${pd.img}" 
              class="card-img-top img-fluid" 
              alt="${pd.name}" 
              style="height: 180px; object-fit: contain;"
              onerror="this.src='https://placehold.co/300x200?text=No+Image'"
            />
          </div>
          <div class="card-body d-flex flex-column p-3">
            <h5 class="card-title fw-bold fs-6 mb-1 text-truncate" title="${pd.name}">
              ${pd.name}
            </h5>
            
            <div class="product-price text-danger fw-bold fs-5 mb-2">
              ${Number(pd.price).toLocaleString()} VNĐ
            </div>
            <p class="card-text text-muted small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${pd.description}
            </p>
            <button 
              class="btn btn-primary w-100 mt-auto py-2 d-flex align-items-center justify-content-center gap-2" 
              onclick="themGioHang('${pd.id}')"
            >
              <i class="fa-solid fa-cart-plus"></i>
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    `;
    contentTb += divPD;
  });
  return contentTb;
};

let getproduct = () => {
  let productObj = getAll();
  productObj
    .then((result) => {
      console.log("API OK");
      const activePD = result.data.filter((pd) => {
        return !pd.deleted;
      });
      document.querySelector("#productList").innerHTML = showproduct(activePD);
      listPD = activePD;
    })
    .catch((error) => {
      console.log("Lỗi API:", error);
      document.querySelector("#productList").innerHTML =
        "<div class='text-center py-5 text-danger col-12'>Vui lòng tải lại trang.</div>";
    });
};

getproduct();

document.querySelector("#selectProductType").addEventListener("change", function () {
  const selecttype = document.querySelector("#selectProductType").value;
  if (selecttype === "all") {
    document.querySelector("#productList").innerHTML = showproduct(listPD);
  } else {
    const filterPD = listPD.filter((item) => {
      return item.type && item.type.toLowerCase() === selecttype.toLowerCase();
    });
    document.querySelector("#productList").innerHTML = showproduct(filterPD);
  }
});

let renderCart = () => {
  const cartTableBody = document.querySelector("#cartTableBody");
  const totalAmount = document.querySelector("#totalAmount");
  const cartBadge = document.querySelector("#cartBadge");

  if (cart.mangGioHang.length === 0) {
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          <i class="fa-regular fa-folder-open fs-3 d-block mb-2"></i>
          Giỏ hàng đang trống
        </td>
      </tr>
    `;
    totalAmount.innerText = "0";
    if (cartBadge) cartBadge.innerText = "0";
    return;
  }

  let content = "";
  cart.mangGioHang.map((item, index) => {
    let thanhTien = item.price * item.quantity;
    let trItem = `
      <tr>
        <td class="text-center fw-semibold">${index + 1}</td>
        <td>
          <img src="${item.img}" class="cart-item-img" alt="${item.name}" 
               onerror="this.src='https://placehold.co/50x50?text=SP'" />
        </td>
        <td class="fw-medium">${item.name}</td>
        <td class="text-end">${Number(item.price).toLocaleString()} VNĐ</td>
        <td class="text-center">
          <div class="d-inline-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary btn-qty" onclick="doiSoLuong('${item.id}', -1)">-</button>
            <span class="fw-bold px-1">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary btn-qty" onclick="doiSoLuong('${item.id}', 1)">+</button>
          </div>
        </td>
        <td class="text-end text-danger fw-bold">
          ${thanhTien.toLocaleString()} VNĐ
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger" onclick="xoaKhoiGioHang('${item.id}')">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
    content += trItem;
  });

  cartTableBody.innerHTML = content;
  totalAmount.innerText = cart.tinhTongTien().toLocaleString();
  if (cartBadge) {
    cartBadge.innerText = cart.tinhTongSoLuong();
  }
};

window.themGioHang = (id) => {
  const spChon = listPD.find((pd) => pd.id === id);
  if (spChon) {
    cart.themGH(spChon);
    renderCart();
    luuLocalStorage();
  }
};

window.doiSoLuong = (id, step) => {
  cart.capNhatSoLuong(id, step);
  renderCart();
  luuLocalStorage();
};

window.xoaKhoiGioHang = (id) => {
  cart.xoaGH(id);
  renderCart();
  luuLocalStorage();
};

document.querySelector("#btnClearCart").addEventListener("click", () => {
  cart.clearCart();
  renderCart();
  luuLocalStorage();
});

document.querySelector("#btnCheckout").addEventListener("click", () => {
  if (cart.mangGioHang.length === 0) {
    alert("Giỏ hàng đang trống, vui lòng chọn sản phẩm trước!");
    return;
  }
  alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
  cart.clearCart();
  renderCart();
  luuLocalStorage();
});

let luuLocalStorage = () => {
  localStorage.setItem("CART_LIST", JSON.stringify(cart.mangGioHang));
};

let layLocalStorage = () => {
  const data = localStorage.getItem("CART_LIST");
  if (data) {
    const rawList = JSON.parse(data);
    cart.mangGioHang = rawList.map(
      (item) => new CartItem(item.id, item.name, item.price, item.img, item.quantity)
    );
    renderCart();
  }
};

layLocalStorage();