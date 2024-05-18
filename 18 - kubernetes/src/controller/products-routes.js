/*
 * Import required modules
 */
import path from "path";
import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import io from "../../app.js";
import { onlyAdminAccess } from "../middlewares/permissions.js";
import {
  MockingProductsServices,
  ProductsServices,
} from "../repositories/Repositories.js";
import {
  InsufficientDataError,
  ProductNotFoundError,
} from "../utils/CustomErrors.js";

/*
 * Create a new router instance
 */
const router = Router();

/*
 * Multer configuration for file uploads
 */
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const filename = uuidv4() + file.originalname;
    cb(null, filename);
  },
  destination: "public/images/products",
});

const upload = multer({
  dest: "src/public",
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|bmp|gif|webp/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimetype === extname) {
      return cb(null, true);
    }
    cb("El archivo debe ser una imágen válida: jpg|jpeg|png|bmp|gif");
  },
});

/*
 * Route to get all products
 */
router.get("/products", async (req, res) => {
  const { query, limit, page, sort } = req.query;

  try {
    const data = await ProductsServices.getAllProducts(
      query,
      page,
      limit,
      sort
    );
    if (!data) throw ProductNotFoundError();
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
 * Route to get a specific product by ID
 */
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);
    const data = await ProductsServices.getProductByID(pid);
    if (!pid) throw new ProductNotFoundError();

    res.status(200).send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
 * Route to create a new product
 */
router.post(
  "/products",
  upload.single("img"),
  onlyAdminAccess,
  async (req, res) => {
    try {
      const { body } = req;
      const { title, description, price, code, stock, category } = body;
      const file = req.file.filename;
      const user = req.user;

      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !category ||
        !file
      )
        throw new InsufficientDataError("product", [
          "title",
          "description",
          "price",
          "code",
          "stock",
          "category",
          "product img",
        ]);

      if (user.role === "PREMIUM") {
        body.thumbnails = "images/products/" + file.trim();
        body.owner = user.email;

        await ProductsServices.createNewProduct(body);

        const newProductsList = await ProductsServices.getAllProducts();
        if (!newProductsList) throw new ProductNotFoundError();
        io.emit("res", newProductsList);
        res.status(201).json({ message: "Producto creado correctamente" });
      } else {
        res.status(403).json({
          message: "Solo los usuarios premium pueden crear productos",
        });
      }
    } catch (error) {
      if (error instanceof InsufficientDataError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send("Internal server error");
      }
    }
  }
);

/*
 * Route to update a product
 */
router.put("/products/:pid", async (req, res) => {
  try {
    const { body } = req;
    const { pid } = req.params;
    const { title, description, price, code, stock, category } = body;
    const user = req.user;

    if (
      !pid ||
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category
    )
      throw new InsufficientDataError("product", [
        "ProductID",
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
      ]);

    const product = await ProductsServices.getProductByID(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (
      user.role === "ADMIN" ||
      (user.role === "PREMIUM" && product.owner === user.email)
    ) {
      const updatedProduct = {
        title,
        description,
        price,
        code,
        stock,
        category,
        owner: product.owner,
      };

      const result = await ProductsServices.updateProduct(pid, updatedProduct);
      res.status(200).json(result);
    } else {
      res
        .status(403)
        .json({ message: "No tienes permiso para actualizar este producto" });
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
 * Route to delete a product
 */
router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const user = req.user;

    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);

    const product = await ProductsServices.getProductByID(pid);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (
      user.role === "ADMIN" ||
      (user.role === "PREMIUM" && product.owner === user.email)
    ) {
      await ProductsServices.deleteProduct(pid);
      res.status(200).json({ message: "Producto eliminado correctamente" });
    } else {
      res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este producto" });
    }
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
 * Route to get mocked products
 */
router.get("/mockingproducts", async (req, res) => {
  try {
    const fakeProducts = MockingProductsServices.getProducts();
    if (!fakeProducts) throw ProductNotFoundError();
    res.status(200).send(fakeProducts);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
 * Export the router
 */
export default router;
