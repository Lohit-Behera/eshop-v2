import { Router } from "express";
import {
  singUp,
  login,
  logout,
  verifyEmail,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";

const authRouter = Router();

authRouter.post("/signup", upload.single("avatar"), resizeImage, singUp);
authRouter.post("/login", login);
authRouter.get("/logout", authMiddleware, logout);
authRouter.get("/verify/:token", verifyEmail);

export default authRouter;
