// Dùng Export
export class CallApi {
  constructor() {
    // Đường dẫn API lấy từ MockAPI của bạn
    this.baseUrl = "https://6a9b8ab10ad174e139e8b634.mockapi.io/Products";
  }

  // 1. Lấy danh sách sản phẩm
  fetchProductList() {
    return axios({
      url: this.baseUrl,
      method: "GET",
    });
  }

  // 2. Xóa sản phẩm theo ID
  deleteProduct(id) {
    return axios({
      url: `${this.baseUrl}/${id}`,
      method: "DELETE",
    });
  }

  // 3. Thêm sản phẩm mới
  addProduct(product) {
    return axios({
      url: this.baseUrl,
      method: "POST",
      data: product,
    });
  }

  // 4. Lấy chi tiết 1 sản phẩm theo ID (để đưa dữ liệu lên form khi bấm Sửa)
  getProductById(id) {
    return axios({
      url: `${this.baseUrl}/${id}`,
      method: "GET",
    });
  }

  // 5. Cập nhật thông tin sản phẩm
  updateProduct(id, product) {
    return axios({
      url: `${this.baseUrl}/${id}`,
      method: "PUT",
      data: product,
    });
  }
}