const express = require('express');
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
const productManager = require("../classes/productManager.js")
const pm = new productManager('../src/json/products.json')

router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || undefined
      const products = await pm.getProducts()
      let responseProducts = products
  
      if (limit) {
        responseProducts = products.slice(0, limit)
        return res.json({products: responseProducts})
      }
      return res.json({products: responseProducts})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  })
  router.get(`/:id`, async (req, res) => {
    try{
      const id = parseInt(req.params.id)
      const searchId = await pm.getProductById(id)
      if (searchId) {
        res.json({idproduct: searchId})
      } else {
        res.status(404).json({ error: 'Product not found'})
      }
    } catch(e) {
      return res.status(500).json({ error: '500 Not found'})
    }
  })
  router.post(`/`, async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body
        const newproduct = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)
        return res.json(newproduct)
    } catch (e) {
        res.status(500).json({ error: '500: Internal server error'})
    }

  })
  
  router.put(`/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const searchId = await pm.getProductById(id);
  
      if (searchId) {
        console.log("FOUND PRODUCT TO EDIT")
        const { title, description, code, price, status, stock, category, thumbnails} = req.body
        await pm.updateProduct(id, { title, description, code, price, status, stock, category, thumbnails})
        return res.json({ message: 'Product updated successfully' })
      } else {
        return res.status(404).json({ error: 'Product not found' })
      }
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Internal server error' })
    }
  });

  router.delete(`/:id`, async(req, res) => {
    try {
      const id = parseInt(req.params.id)
      const deleteProduct = await pm.deleteProduct(id)
      return res.json(deleteProduct)
    } catch(e) {
      res.status(505).json({ error: '505: Internal server error'})
    }
  })

module.exports = router;