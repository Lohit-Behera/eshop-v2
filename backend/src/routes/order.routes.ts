import { Router } from "express";
import {
  orderInitializeRazorpay,
  orderPlacedRazorpay,
  getOrder,
  profileOrderList,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const orderRouter = Router();

orderRouter.post(
  "/initialize/razorpay",
  authMiddleware,
  orderInitializeRazorpay
);
orderRouter.post("/placed/razorpay", authMiddleware, orderPlacedRazorpay);
orderRouter.get("/get/:orderId", authMiddleware, getOrder);
orderRouter.get("/profile", authMiddleware, profileOrderList);

export default orderRouter;
