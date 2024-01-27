const express = require("express")
const productsRoutes = require("./routes/products.routes")
const cartRoutes = require("./routes/cart.routes")

const PORT = 8080
const app = express()
const API_PREFIX = "api"

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.use(`/${API_PREFIX}/products`, productsRoutes)
app.use(`/${API_PREFIX}/carts`, cartRoutes)

app.listen(PORT, () => {
  console.log('API running')
})