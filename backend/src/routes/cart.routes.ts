import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { addToCart, getCart } from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/get", authMiddleware, getCart);

export default cartRouter;
