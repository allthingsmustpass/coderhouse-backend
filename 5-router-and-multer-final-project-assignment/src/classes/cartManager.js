const fs = require("fs/promises")

class CartManager {
    constructor(path) {
        this.path = path;
        this.id = 1;
        this.cartList = [];
    }

    async ensureFile() {
        try {
            await fs.access(this.path)
        } catch (error) {
            await fs.writeFile(this.path, '{"carts": []}', { encoding: 'utf-8' })
        }
    }

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