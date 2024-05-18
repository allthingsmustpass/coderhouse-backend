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
   * Adds a product to the cart
   * @param {string} _id - The ID of the cart
   * @param {string} pid - The ID of the product
   * @param {number} quantity - The quantity of the product to add
   * @returns {Promise<Object>} The updated cart
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
   * Gets the cart by its ID
   * @param {string} _id - The ID of the cart
   * @returns {Promise<Object>} The cart with populated product details
   */
  static async getCartByID(_id) {
    const cart = await cartsModel
      .findOne({ _id })
      .populate("products.productId")
      .lean();
    return cart;
  }

  /**
   * Deletes a product from the cart
   * @param {string} cartID - The ID of the cart
   * @param {string} productID - The ID of the product to delete
   * @returns {Promise<Object>} The updated cart
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
   * Deletes the cart by its ID
   * @param {string} cartID - The ID of the cart
   * @returns {Promise<Object>} The deleted cart
   */
  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }

  /**
   * Updates the cart with new data
   * @param {string} cartID - The ID of the cart
   * @param {Object} newData - The new data for the cart
   * @returns {Promise<Object>} The updated cart
   */
  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  /**
   * Updates a product in the cart
   * @param {string} cartID - The ID of the cart
   * @param {string} productID - The ID of the product to update
   * @param {number} quantity - The new quantity of the product
   * @returns {Promise<Object>} The updated cart
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
   * Processes the purchase of the cart
   * @param {string} cartID - The ID of the cart
   * @returns {Promise<Object>} An object containing the leftover products and the total amount
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
