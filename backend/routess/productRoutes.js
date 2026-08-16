import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// public: anyone can browse products
router.get("/", getProducts);
router.get("/:id", getProduct);

// admin-only: only the store owner can add, edit, or remove products
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
