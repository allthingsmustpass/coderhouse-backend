const express = require("express")
const productManager = require("../productManager")

const PORT = 8080
const app = express()
const pm = new productManager('./products.json')

app.use(express.urlencoded({ extends: true}))
app.use(express.json())

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined
    const products = await pm.getProducts()
    let responseProducts = products

    if (limit) {
      responseProducts = products.slice(0, limit)
      return res.json(responseProducts)
    }
    return res.json(responseProducts)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/products/:id', async (req, res) => {
  try{
    const id = parseInt(req.params.id)
    const searchId = await pm.getProductById(id)
    if (searchId) {
      res.json(searchId)
    } else {
      res.status(404).json({ error: 'Product not found'})
    }
  } catch(e) {
    return res.status(404).json({ error: '404 Not found'})
  }
})

app.listen(PORT, () => {
  console.log('API running')
})