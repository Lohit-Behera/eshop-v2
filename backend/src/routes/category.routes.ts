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
  deleteSubCategory,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("thumbnail"),
  resizeImage,
  createCategory
);
categoryRouter.get("/:categoryId", authMiddleware, getCategory);
categoryRouter.patch(
  "/update",
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
categoryRouter.delete(
  "/sub/:categoryId/:subCategoryId",
  authMiddleware,
  adminMiddleware,
  deleteSubCategory
);
// public routes
categoryRouter.get("/get/all", getAllCategories);
export default categoryRouter;
