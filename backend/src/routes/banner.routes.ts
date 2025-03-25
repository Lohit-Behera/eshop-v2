import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getBanner,
} from "../controllers/bannerController";

const bannerRouter = Router();

bannerRouter.post("/create", createBanner);
bannerRouter.get("/all", getAllBanners);
bannerRouter.get("/get/:bannerId", getBanner);
bannerRouter.delete("/delete/:bannerId", deleteBanner);

export default bannerRouter;
