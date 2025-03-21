import { Router } from "express";
import {
  orderInitializeRazorpay,
  getOrder,
  profileOrderList,
  verifyRazorpayPayment,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const orderRouter = Router();

orderRouter.post(
  "/initialize/razorpay",
  authMiddleware,
  orderInitializeRazorpay
);
orderRouter.post("/verify/razorpay", verifyRazorpayPayment);

orderRouter.get("/get/:orderId", authMiddleware, getOrder);
orderRouter.get("/profile", authMiddleware, profileOrderList);

export default orderRouter;
