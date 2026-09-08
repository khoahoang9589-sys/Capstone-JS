export class Product {
  constructor(id, name, price, img, description, type, deleted = false) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.description = description;
    this.type = type; // LAPTOP / PHONE / TABLET / iphone
    this.deleted = deleted;
  }
}