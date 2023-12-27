class ProductManager {
    constructor() {
        this.products = []
        this.id = 1
    }

    addProduct(title, description, price, thumbnail, code, stock) {

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
        this.id++    
        this.products.push(product)
            
    }

    getProducts = () => {
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
const manageProducts = new ProductManager();

// Llama “getProducts” y retorna una array vacío
let returnProducts = manageProducts.getProducts()
console.log(returnProducts)

// Crea el objeto con un ID automáticamente sin repetirse.
manageProducts.addProduct("producto prueba”", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// Llama “getProducts” y retorna el objeto.
returnProducts = manageProducts.getProducts()
console.log(returnProducts)
 
// Crea el objeto nuevamente, pero advierte un error dado que se encuentra repetido.
manageProducts.addProduct("producto prueba”", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

//Retorna el objeto con el ID correcto.
findProduct = manageProducts.getProductById(1)
console.log(findProduct)

//Muestra error debido a que no existe el producto con ese ID.
findProduct = manageProducts.getProductById(2)
console.log(findProduct)


