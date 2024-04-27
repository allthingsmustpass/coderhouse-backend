const Cart = require('../CartModel.js');

class CartManager {
    /**
     * Crea un nuevo gestor de carritos.
     */
    constructor() {
        this.cartList = [];
        this.id = 1;
    }

    /**
     * Añade un nuevo carrito.
     */
    async createCart() {
        try {
            const newCart = new Cart({
                id: this.id,
                products: []
            });

            await newCart.save();
            this.cartList.push(newCart);
            this.id++;

            return newCart;
        } catch (error) {
            console.error("Error creando carrito:", error);
            return null;
        }
    }

    /**
     * Obtiene un carrito por su ID.
     */
    async getCartById(cartId) {
        return this.cartList.find(cart => cart.id === cartId);
    }

    /**
     * Añade un producto a un carrito existente.
     */
    async addProductToCart(cartId, productId, quantity) {
        const cart = this.cartList.find(cart => cart.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex === -1) {
            cart.products.push({ productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        await cart.save();

        return cart;
    }

    /**
     * Obtiene todos los carritos almacenados.
     */
    async getAllCarts() {
        try {
            const carts = await Cart.find();
            return carts;
        } catch (error) {
            console.error("Error obteniendo carritos:", error);
            return [];
        }
    }
}

module.exports = CartManager;
