import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  addToCart,
  getCart,
  changeQuantity,
  removeFromCart,
} from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/get", authMiddleware, getCart);
cartRouter.patch("/update", authMiddleware, changeQuantity);
cartRouter.delete("/remove/:productId", authMiddleware, removeFromCart);

export default cartRouter;
