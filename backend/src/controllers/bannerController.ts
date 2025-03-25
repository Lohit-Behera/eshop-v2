import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Banner } from "../models/bannerModel";
import { deleteFile, uploadFile } from "../utils/cloudinary";

const createBanner = asyncHandler(async (req, res) => {
  // get link from the body
  const { link } = req.body;
  // check banner limit
  const countBanner = await Banner.countDocuments();
  if (countBanner >= 3) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Banner limit reached"));
  }
  // get image from the body
  const image = req.file;
  if (!image) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required"));
  }
  // upload image to cloudinary
  const imageUrl = await uploadFile(image, "banner");

  // create banner
  const banner = await Banner.create({ image: imageUrl, link });
  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner created successfully"));
});

// get all banners
const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });

  if (!banners || banners.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Banners not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, banners, "Banners found successfully"));
});

// get banner by id
const getBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.bannerId);
  if (!banner) {
    return res.status(404).json(new ApiResponse(404, null, "Banner not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner found successfully"));
});

// delete banner by id
const deleteBanner = asyncHandler(async (req, res) => {
  // get banner id from the params
  const { bannerId } = req.params;
  // get the banner
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    return res.status(404).json(new ApiResponse(404, null, "Banner not found"));
  }
  // delete image from cloudinary
  if (banner.image) {
    await deleteFile(banner.image, "eshop/banner", res);
  }
  // delete the banner
  await Banner.findByIdAndDelete(bannerId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Banner deleted successfully"));
});

export { createBanner, getAllBanners, getBanner, deleteBanner };
