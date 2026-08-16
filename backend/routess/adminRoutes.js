import express from "express";
import { verifyAdmin } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/verify", requireAdmin, verifyAdmin);

export default router;
