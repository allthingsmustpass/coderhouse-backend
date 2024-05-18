import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartProduct'
 *     CartProduct:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: The ID of the product in the cart.
 *         quantity:
 *           type: number
 *           description: The quantity of the product in the cart.
 *           default: 1
 */
const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartsModel = mongoose.model("carts", cartSchema);
export default cartsModel;
