// Dùng Export
export class CallApi {
  constructor() {
    this.baseUrl = "https://svcy.myclass.vn/api/ProductApi";
  }

  // 1. Lấy danh sách sản phẩm
  fetchProductList() {
    return axios({
      url: `${this.baseUrl}/getall`,
      method: "GET",
    });
  }

  // 2. Xóa sản phẩm theo ID
  deleteProduct(id) {
    return axios({
      url: `${this.baseUrl}/delete/${id}`,
      method: "DELETE",
    });
  }

  // 3. Thêm sản phẩm mới
  addProduct(product) {
    return axios({
      url: `${this.baseUrl}/create`,
      method: "POST",
      data: product,
    });
  }

  // 4. Lấy chi tiết 1 sản phẩm theo ID
  getProductById(id) {
    return axios({
      url: `${this.baseUrl}/get/${id}`,
      method: "GET",
    });
  }

  // 5. Cập nhật thông tin sản phẩm
  updateProduct(id, product) {
    return axios({
      url: `${this.baseUrl}/update/${id}`,
      method: "PUT",
      data: product,
    });
  }
}