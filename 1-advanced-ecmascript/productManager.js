class productManager {
    constructor() {
        this.products = []
        this.id = 1
    }

    addProduct(title, description, price, thumbnail, stock, code) {

        const codeExists = this.products.find(product => product.code === code)
        if(codeExists){
            console.error("Code already exists.")
            return
        }

        const isValid = title && description && price && thumbnail && code && stock
        if(!isValid) {
            console.error("All fields required.")
            return
        }

        const product = {
            title, description, price, thumbnail, code, stock, id: this.id
        }
            this.products.push(product)
            this.id++
    }

    getProduct = () => {
        console.table(this.products)
        return this.products
    }

    getProductById = (id) => {
        const findProduct = this.products.find(product => product.id === id)

        if(!findProduct) {
            console.log("Not found.")
        }

        return findProduct
    }
}
//Crea una instancia.
const manageProducts = new productManager();
//Crea objeto válidos.
manageProducts.addProduct("Producto numero uno", "Un zapato", 300, "zapato.png", "ABC1", 10);
manageProducts.addProduct("Producto numero dos", "Una pc", 5000, "pc.png", "ABC2", 50);
manageProducts.addProduct("Producto numero tres", "Una camiseta", 20, "camiseta.png", "ABC3", 600);
manageProducts.addProduct("Producto numero tres", "Una camiseta", 20, "camiseta.png", "ABC3", 600);
//Retorna el array.
printproducts = manageProducts.getProduct()
//Retorna el objeto con el ID correcto.
findProduct = manageProducts.getProductById(3)
console.log(findProduct)


//const product1 = manageProducts.getProductById(2);
//console.log(product1);
