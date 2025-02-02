import { Router } from "express";
import { userDetails } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get("/details", authMiddleware, userDetails);

export default userRouter;
