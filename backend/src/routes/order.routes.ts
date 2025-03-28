import { Router } from "express";
import {
  orderInitializeRazorpay,
  getOrder,
  profileOrderList,
  verifyRazorpayPayment,
  verifyCashFreePayment,
  orderInitializeCashFree,
  orderAdminList,
  orderUpdate,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { rawBodyMiddleware } from "../middlewares/rawBodyMiddleware";

const orderRouter = Router();

orderRouter.post(
  "/initialize/razorpay",
  authMiddleware,
  orderInitializeRazorpay
);
orderRouter.post("/verify/razorpay", verifyRazorpayPayment);

orderRouter.get("/get/:orderId", authMiddleware, getOrder);
orderRouter.get("/profile", authMiddleware, profileOrderList);

orderRouter.post(
  "/initialize/cashfree",
  authMiddleware,
  orderInitializeCashFree
);
orderRouter.post("/verify/cashfree", rawBodyMiddleware, verifyCashFreePayment);

orderRouter.get(
  "/admin/orders",
  authMiddleware,
  adminMiddleware,
  orderAdminList
);

orderRouter.patch(
  "/admin/update/:orderId",
  authMiddleware,
  adminMiddleware,
  orderUpdate
);

export default orderRouter;
