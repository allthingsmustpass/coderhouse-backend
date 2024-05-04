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
 * Obtiene un carrito por su ID.
 * 
 * @param {string} cid - ID del carrito.
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
 * Crea un nuevo carrito.
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
 * Agrega un producto al carrito.
 */
router.post("/carts/:cid/products/:pid", onlyUsersAccess, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    if (!quantity || !cid || !pid)
      throw new InsufficientDataError("product", ["quantity", "cartID", "ProductID"]);
    const data = await CartServices.addToCart(cid, pid, quantity);
    res.status(201).send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Elimina un producto del carrito por su ID.
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
