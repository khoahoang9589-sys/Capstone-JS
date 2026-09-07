export class Validation {
  // Kiểm tra trường dữ liệu có bị để trống hay không
  checkEmpty(value, spanId, message) {
    if (value.trim() === "") {
      document.getElementById(spanId).innerHTML = message;
      document.getElementById(spanId).style.display = "block";
      return false;
    }
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  // Kiểm tra giá tiền (phải là số và lớn hơn 0)
  checkPrice(value, spanId, message) {
    if (value.trim() === "" || isNaN(value) || Number(value) <= 0) {
      document.getElementById(spanId).innerHTML = message;
      document.getElementById(spanId).style.display = "block";
      return false;
    }
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  // Kiểm tra xem đã chọn option trong thẻ select chưa (ví dụ chọn type)
  checkSelect(selectId, spanId, message) {
    const value = document.getElementById(selectId).value;
    if (value === "0" || value === "") {
      document.getElementById(spanId).innerHTML = message;
      document.getElementById(spanId).style.display = "block";
      return false;
    }
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }
}