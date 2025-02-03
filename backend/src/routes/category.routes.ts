import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("thumbnail"),
  resizeImage,
  createCategory
);
categoryRouter.get("/:categoryId", authMiddleware, getCategory);
categoryRouter.get("/", authMiddleware, getAllCategories);
categoryRouter.patch(
  "/:categoryId",
  authMiddleware,
  adminMiddleware,
  upload.single("thumbnail"),
  resizeImage,
  updateCategory
);
categoryRouter.delete(
  "/:categoryId",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);
