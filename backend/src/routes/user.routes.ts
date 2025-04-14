import { Router } from "express";
import { userDetails, updateAvatar } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";

const userRouter = Router();

userRouter.get("/details", authMiddleware, userDetails);

userRouter.patch(
  "/update/avatar",
  authMiddleware,
  upload.single("avatar"),
  resizeImage,
  updateAvatar
);

export default userRouter;
