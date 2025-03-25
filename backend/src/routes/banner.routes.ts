import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getBanner,
} from "../controllers/bannerController";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";

const bannerRouter = Router();

bannerRouter.post("/create", upload.single("image"), resizeImage, createBanner);
bannerRouter.get("/all", getAllBanners);
bannerRouter.get("/get/:bannerId", getBanner);
bannerRouter.delete("/delete/:bannerId", deleteBanner);

export default bannerRouter;
