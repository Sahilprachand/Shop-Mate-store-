import express from "express";
import { createOrder, getOrders, getOrder, trackOrder, updateOrderStatus } from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// admin-only: listing all orders, viewing any single order, and changing
// status all require the admin key
router.get("/", requireAdmin, getOrders);
router.get("/:id", requireAdmin, getOrder);
router.patch("/:id/status", requireAdmin, updateOrderStatus);

// public: customers can track their own order (email-verified) and place new orders
router.get("/track/:id", trackOrder);
router.post("/", createOrder);

export default router;
