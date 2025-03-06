import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createProduct,
  allProducts,
  productDetails,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const productRouter = Router();

productRouter.post(
  "/create",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  resizeImage,
  createProduct
);

productRouter.get("/all", authMiddleware, allProducts);

productRouter.get("/:productId", authMiddleware, productDetails);

productRouter.patch(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  resizeImage,
  updateProduct
);

productRouter.delete("/delete/:productId", authMiddleware, deleteProduct);

export default productRouter;
