import { Router } from "express";
import CartDao from "../dao/cartDao.js";
import ProductsDao from "../dao/productDao.js";
import UsersDao from "../dao/usersDao.js";
import auth from "../middlewares/auth.js";

// Create a new router instance
const router = Router();

// Redirect to login page
router.get("/", async (req, res) => {
  res.redirect("/login");
});

// Render login page or redirect to products page if user is logged in
router.get("/login", async (req, res) => {
  try {
    const { userId } = req.session;
    if (userId) {
      res.redirect("/products");
    } else {
      res.render("login");
    }
  } catch (error) {
    res.send("Error interno en el servidor");
  }
});

// Render register page
router.get("/register", async (req, res) => {
  res.render("register");
});

// Render user profile page
router.get("/profile", async (req, res) => {
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);
  res.render("profile", { userData });
});

// Render products page with filtering and sorting options
router.get("/products", auth, async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);

  res.render("home", { data, userData });
});

// Render product details page
router.get("/product/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await ProductsDao.getProductByID(_id);
  res.render("product", { data });
});

// Render cart page
router.get("/cart/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await CartDao.getCartByID(_id);
  res.render("cart", { data });
});

// Render real-time products page
router.get("/realtimeproducts", auth, (req, res) => {
  res.render("realTimeProducts");
});

// Render admin page
router.get("/admin", auth, (req, res) => {
  res.render("admin");
});

// Render chat page
router.get("/chat", auth, (req, res) => {
  res.render("chat");
});

// Render password change success page
router.get("/password-success", (req, res) => {
  res.render("passwordChanges");
});

export default router;
