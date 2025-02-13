import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createProduct,
  allProducts,
  productDetails,
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

export default productRouter;
