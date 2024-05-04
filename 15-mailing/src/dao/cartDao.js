import cartsModel from "../model/carts.model.js";
import productsModel from "../model/products.model.js";
import { ProductsServices } from "../repositories/Repositories.js";
export default class CartDao {
  static async createNewcart() {
    return cartsModel.create({});
  }
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
  static async getCartByID(_id) {
    const cart = await cartsModel
      .findOne({ _id })
      .populate("products.productId")
      .lean();
    return cart;
  }

  static async deleteCartProductByID(cartID, productID) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productID
    );
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }
  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }
  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }
  static async updateCartProductsByID(cartID, productID, quantity) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      (product) => product.productId !== productID
    );
    cart.products.push({ productId: productID, quantity });
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }
  static async purchase(cartID) {
    const cart = await this.getCartByID(cartID);
    const ids = [];

    cart.products.map((p) => ids.push(p.productId));
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
