// cart-system.js

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    const existing = this.items.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    console.log(`${product.name} added to cart`);
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
    console.log("Item removed");
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  displayCart() {
    console.log("\n=== Cart Items ===");
    this.items.forEach(item => {
      console.log(`${item.product.name} x${item.quantity} = $${item.product.price * item.quantity}`);
    });
    console.log("Total: $" + this.getTotal());
  }
}

// Simulation
const p1 = new Product(1, "Shoes", 50);
const p2 = new Product(2, "T-Shirt", 20);

const cart = new Cart();
cart.addItem(p1, 2);
cart.addItem(p2, 3);
cart.displayCart();
cart.removeItem(1);
cart.displayCart();