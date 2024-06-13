import { Router } from "express";
import {
  CartServices,
  TicketsServices,
  UserServices,
} from "../repositories/Repositories.js";
import { onlyUsersAccess } from "../middlewares/permissions.js";
import {
  CartNotBuyError,
  CartNotCreatedError,
  CartNotFoundError,
  CartNotUpdatedError,
  InsufficientDataError,
  ProductCartNotDeletedError,
  TicketNotCreatedError,
  UserNotFoundError,
} from "../utils/CustomErrors.js";

const router = Router();

/**
 * @swagger
 * /carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por su ID.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) throw new InsufficientDataError("Cart", ["CartID"]);
    const data = await CartServices.getCartByID(cid);
    if (!data) throw new CartNotFoundError();

    res.status(200).send(data);
  } catch (error) {
    if (error instanceof CartNotFoundError || error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Error interno del servidor");
    }
  }
});

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Crea un nuevo carrito.
 *     responses:
 *       201:
 *         description: Carrito creado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/carts", async (req, res) => {
  try {
    const newCartID = await CartServices.createNewcart();
    if (!newCartID) throw new CartNotCreatedError();
    res.status(201).send(`Carro ${newCartID} creado`);
  } catch (error) {
    if (error instanceof CartNotCreatedError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: quantity
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       201:
 *         description: Producto agregado al carrito
 *       403:
 *         description: No puedes agregar tus propios productos al carrito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/carts/:cid/products/:pid", onlyUsersAccess, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    const user = req.user;
    
    if (!quantity || !cid || !pid)
      throw new InsufficientDataError("product", ["quantity", "cartID", "ProductID"]);

    const cart = await CartServices.getCartByID(cid);
    const product = await ProductsServices.getProductByID(pid);

    if (!cart || !product) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }

    if (user.role === 'PREMIUM' && product.owner === user.email) {
      return res.status(403).json({ message: 'No puedes agregar tus propios productos al carrito' });
    }

    const data = await CartServices.addToCart(cid, pid, quantity);
    res.status(201).json(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});


/**
 * @swagger
 * /carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito por su ID.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       404:
 *         description: Carrito o producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!cid || !pid)
      throw new InsufficientDataError("Cart", ["cartID", "ProductID"]);
    const data = await CartServices.deleteCartProductByID(cid, pid);
    if (!data) throw new ProductCartNotDeletedError();
    res.send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError || error instanceof ProductCartNotDeletedError) {
      res.status(error.statusCode).send(error.getErrorData() || error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

// Resto del código sigue el mismo patrón...

export default router;
