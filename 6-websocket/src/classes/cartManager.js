const fs = require("fs/promises")

/**
 * Clase que gestiona operaciones con productManager.
 */
class CartManager {
    /**
     * Constructor de la clase.
     * @param {string} path - Ruta del archivo JSON que almacena la información de los carritos.
     */
    constructor(path) {
        this.path = path;
        this.id = 1;
        this.cartList = [];
    }

    /**
     * Asegura la existencia del archivo JSON. Si no existe, lo crea con un formato inicial.
     */
    async ensureFile() {
        try {
            await fs.access(this.path)
        } catch (error) {
            await fs.writeFile(this.path, '{"carts": []}', { encoding: 'utf-8' })
        }
    }

     /** Crea un nuevo carrito y lo guarda en el archivo JSON.
     * @returns {Object} - El carrito creado.
     */
    async createCart() {
        try {
            await this.ensureFile();
            const currentContent = await fs.readFile(this.path, 'utf-8')
            let cartsData

            try {
                cartsData = JSON.parse(currentContent)
            } catch (e) {
                console.error('Error parsing existing JSON:', error)
                return;
            }

            const cart = {
                id: this.id,
                products: []
            };
            this.id++;
            cartsData.carts.push(cart)
            await fs.writeFile(this.path, JSON.stringify(cartsData, null, 4), 'utf-8')
            return cart
        } catch (e) {
            console.error("Error creating cart: ", error)
        }
    }

    /**
     * Obtiene un carrito por su ID.
     * @param {number} cartId - ID del carrito a buscar.
     * @returns {Object|null} - El carrito encontrado o null si no se encuentra.
     */
    async getCartById(cartId) {
        try {
            const currentContent = await fs.readFile(this.path, 'utf-8')
            const cartsData = JSON.parse(currentContent)
            const cart = cartsData.carts.find((cart) => cart.id === cartId)

            if (!cart) {
                console.log("Cart not found.")
            } else {
                console.log("Cart found: ")
                console.log(cart)
            }

            return cart
        } catch (e) {
            console.error("Error: ", error)
        }
    }
    
    /**
     * Agrega un producto a un carrito específico con la cantidad especificada.
     * @param {number} cartId - ID del carrito.
     * @param {number} productId - ID del producto a agregar.
     * @param {number} quantity - Cantidad del producto a agregar.
     */
    async addProductToCart(cartId, productId, quantity) {
        try {
            const currentContent = await fs.readFile(this.path, 'utf-8')
            let cartsData
            try {
                cartsData = JSON.parse(currentContent)
            } catch (e) {
                console.error('Error parsing existing JSON:', error)
                return
            }

            const cartIndex = cartsData.carts.findIndex(cart => cart.id === cartId)

            if (cartIndex === -1) {
                console.log("Invalid Cart ID.");
                return;
            }

            const productIndex = cartsData.carts[cartIndex].products.findIndex(product => product.id === productId)

            if (productIndex === -1) {
                cartsData.carts[cartIndex].products.push({ id: productId, quantity })
            } else {
                cartsData.carts[cartIndex].products[productIndex].quantity += quantity
            }

            await fs.writeFile(this.path, JSON.stringify(cartsData, null, 4), 'utf-8')
        } catch (e) {
            console.error("Error adding product to cart: ", error);
        }
    }
}

module.exports = CartManager