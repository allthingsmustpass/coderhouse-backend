/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the cart
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartProduct'
 *     CartProduct:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product
 *   responses:
 *     CartNotFound:
 *       description: Cart not found
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "Cart Not Found"
 *   requestBodies:
 *     AddToCartRequest:
 *       description: Request body for adding a product to the cart
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartProduct'
 *     UpdateCartProductRequest:
 *       description: Request body for updating a product in the cart
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartProduct'
 *     UpdateCartRequest:
 *       description: Request body for updating the cart
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/CartProduct'
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Creates a new empty cart
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
import cartsModel from "../model/carts.model.js";
import { ProductsServices } from "../repositories/Repositories.js";

/**
 * CartDao class for managing cart operations
 */
export default class CartDao {
  /**
   * Creates a new empty cart
   * @returns {Promise<Object>} The newly created cart
   */
  static async createNewcart() {
    return cartsModel.create({});
  }

  /**
   * @swagger
   * /carts/{cartId}/products:
   *   post:
   *     summary: Adds a product to the cart
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       $ref: '#/components/requestBodies/AddToCartRequest'
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async addToCart(_id, pid, quantity) {
    const cart = await cartsModel.findOne({ _id }).lean();

    if (!cart) {
      return "Cart Not Found";
    }

    const product = await cartsModel
      .findOne({ _id, "products.productId": pid })
      .lean();

    if (!product) {
      return cartsModel.findByIdAndUpdate(
        { _id },
        { $push: { products: { productId: pid, quantity } } },
        { new: true }
      );
    } else {
      return cartsModel.findOneAndUpdate(
        { _id, "products.productId": pid },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      );
    }
  }

  /**
   * @swagger
   * /carts/{cartId}:
   *   get:
   *     summary: Gets the cart by its ID
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async getCartByID(_id) {
    const cart = await cartsModel
      .findOne({ _id })
      .populate("products.productId")
      .lean();
    return cart;
  }

  /**
   * @swagger
   * /carts/{cartId}/products/{productId}:
   *   delete:
   *     summary: Deletes a product from the cart
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async deleteCartProductByID(cartID, productID) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      product => product.productId.toString() !== productID
    );
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  /**
   * @swagger
   * /carts/{cartId}:
   *   delete:
   *     summary: Deletes the cart by its ID
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }

  /**
   * @swagger
   * /carts/{cartId}:
   *   put:
   *     summary: Updates the cart with new data
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       $ref: '#/components/requestBodies/UpdateCartRequest'
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  /**
   * @swagger
   * /carts/{cartId}/products/{productId}:
   *   put:
   *     summary: Updates a product in the cart
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       $ref: '#/components/requestBodies/UpdateCartProductRequest'
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async updateCartProductsByID(cartID, productID, quantity) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      product => product.productId !== productID
    );
    cart.products.push({ productId: productID, quantity });
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  /**
   * @swagger
   * /carts/{cartId}/purchase:
   *   post:
   *     summary: Processes the purchase of the cart
   *     parameters:
   *       - in: path
   *         name: cartId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Successful response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 leftiesCart:
   *                   type: array
   *                   items:
   *                     type: string
   *                   description: The IDs of products that could not be purchased due to insufficient stock
   *                 amount:
   *                   type: number
   *                   description: The total amount of the purchase
   *       '404':
   *         $ref: '#/components/responses/CartNotFound'
   */
  static async purchase(cartID) {
    const cart = await this.getCartByID(cartID);
    const ids = [];

    cart.products.map(p => ids.push(p.productId));
    let amount = 0;
    const products = await ProductsServices.getProductsByManyIDs(ids);
    const leftiesCart = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].stock >= cart.products[i].quantity) {
        const newQuantity = products[i].stock - cart.products[i].quantity;
        amount += products[i].price * cart.products[i].quantity;
        await ProductsServices.consumeStock(products[i]._id, newQuantity);
      } else {
        leftiesCart.push(cart.products[i].productId._id);
      }
    }

    return { leftiesCart, amount };
  }
}
