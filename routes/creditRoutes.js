// routes/creditRoutes.js
import express from "express";
import {
  getAllCredits,
  getCreditById,
  createCredit,
  updateCredit,
  deleteCredit,
  addPayment,
  deletePayment,
} from "../controllers/creditController.js";

const router = express.Router();

router.get("/", getAllCredits);
router.get("/:id", getCreditById);
router.post("/", createCredit);
router.put("/:id", updateCredit);
router.delete("/:id", deleteCredit);

// Payments
router.post("/:id/payments", addPayment);
router.delete("/:id/payments/:paymentId", deletePayment);

export default router;