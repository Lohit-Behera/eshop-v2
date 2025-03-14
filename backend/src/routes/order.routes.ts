import { Router } from "express";
import {
  orderInitialize,
  orderPlacedRazorpay,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const orderRouter = Router();

orderRouter.post("/initialize", authMiddleware, orderInitialize);
orderRouter.post("/placed/razorpay", authMiddleware, orderPlacedRazorpay);

export default orderRouter;
