const fs = require("fs/promises")
const Cart = require('./models/CartModel.js');

class CartManager {
    /**
     * Crea un nuevo gestor de carritos.
     * @param {string} path - Ruta del archivo donde se almacenarán los datos de los carritos.
     */
    constructor(path) {
        this.path = path;
        this.id = 1; // Identificador único para los carritos
        this.cartList = []; // Lista de carritos almacenados en memoria
    }

    /**
     * Verifica si el archivo de almacenamiento existe. Si no existe, lo crea con un formato inicial.
     */
    async ensureFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await fs.writeFile(this.path, '{"carts": []}', { encoding: 'utf-8' });
        }
    }

    /**
     * Crea un nuevo carrito y lo guarda en el archivo de almacenamiento.
     * @returns {Object} - El nuevo carrito creado.
     */
    async createCart() {
        try {
            await this.ensureFile();
            const currentContent = await fs.readFile(this.path, 'utf-8');
            let cartsData;

            try {
                cartsData = JSON.parse(currentContent);
            } catch (error) {
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
        } catch (error) {
            console.error("Error creating cart: ", error);
        }
    }

    /**
     * Obtiene un carrito por su ID.
     * @param {number} cartId - ID del carrito a buscar.
     * @returns {Object|null} - El carrito encontrado o null si no se encontró ningún carrito con el ID proporcionado.
     */
    async getCartById(cartId) {
        try {
            const cart = await Cart.findOne({ id: cartId });
            return cart ? cart.toObject() : null;
        } catch (error) {
            console.error("Error getting cart by ID:", error);
            return null;
        }
    }

    /**
     * Añade un producto a un carrito existente.
     * @param {number} cartId - ID del carrito al que se añadirá el producto.
     * @param {string} productId - ID del producto a añadir.
     * @param {number} quantity - Cantidad del producto a añadir.
     */
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

    /**
     * Obtiene todos los carritos almacenados.
     * @returns {Array} - Un array con todos los carritos almacenados.
     */
    async getAllCarts() {
        try {
            const allCarts = await Cart.find();
            return allCarts;
        } catch (error) {
            console.error("Error getting all carts:", error);
            return [];
        }
    }
}

module.exports = CartManager;
