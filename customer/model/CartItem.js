export class CartItem {
    constructor(id, name, price, img, quantity = 1) {
        this.id = id;
        this.name = name;
        this.price = Number(price);
        this.img = img;
        this.quantity = Number(quantity);
    }

    tinhThanhTien() {
        return this.price * this.quantity;
    }
}

export class Cart {
    constructor() {
        this.mangGioHang = [];
    }

    timViTri(id) {
        return this.mangGioHang.findIndex((item) => item.id === id);
    }

    themGH(product) {
        const viTri = this.timViTri(product.id);
        if (viTri !== -1) {

            this.mangGioHang[viTri].quantity += 1;
        } else {
            const newItem = new CartItem(
                product.id,
                product.name,
                product.price,
                product.img,
                1
            );
            this.mangGioHang.push(newItem);
        }
    }
    xoaGH(id) {
        const viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.mangGioHang.splice(viTri, 1);
        }
    }
    capNhatSoLuong(id, buocNhay) {
        const viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.mangGioHang[viTri].quantity += buocNhay;
            if (this.mangGioHang[viTri].quantity <= 0) {
                this.xoaGH(id);
            }
        }
    }
    tinhTongTien() {
        return this.mangGioHang.reduce((tong, item) => {
            return tong + item.price * item.quantity;
        }, 0);
    }
    tinhTongSoLuong() {
        return this.mangGioHang.reduce((tong, item) => {
            return tong + item.quantity;
        }, 0);
    }
    clearCart() {
        this.mangGioHang = [];
    }
}