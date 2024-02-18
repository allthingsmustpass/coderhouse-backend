const fs = require("fs/promises")
const Cart = require('./models/CartModel.js');

class CartManager {
    constructor(path) {
        this.path = path;
        this.id = 1;
        this.cartList = [];
    }

    async ensureFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '{"carts": []}', { encoding: 'utf-8' });
        }
    }

    async createCart() {
        try {
            await this.ensureFile();
            const currentContent = await fs.readFile(this.path, 'utf-8');
            let cartsData;

            try {
                cartsData = JSON.parse(currentContent);
            } catch (e) {
                console.error('Error parsing existing JSON:', error);
                return;
            }

            const newCart = new Cart({
                id: this.id,
                products: []
            });
            this.id++;

            await newCart.save();

            cartsData.carts.push(newCart.toObject());
            await fs.writeFile(this.path, JSON.stringify(cartsData, null, 4), 'utf-8');
            return newCart.toObject();
        } catch (e) {
            console.error("Error creating cart: ", error);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findOne({ id: cartId });
            return cart ? cart.toObject() : null;
        } catch (error) {
            console.error("Error getting cart by ID:", error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findOne({ id: cartId });
            if (!cart) {
                console.log("Invalid Cart ID.");
                return;
            }

            const productIndex = cart.products.findIndex(product => product.productId === productId);

            if (productIndex === -1) {
                cart.products.push({ productId, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();
        } catch (error) {
            console.error("Error adding product to cart: ", error);
        }
    }
}

module.exports = CartManager;