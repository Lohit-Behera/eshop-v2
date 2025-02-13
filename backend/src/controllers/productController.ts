import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Product } from "../models/productModel";
import Joi from "joi";
import { uploadFile, deleteFile } from "../utils/cloudinary";

const createProduct = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    originalPrice: Joi.number().required(),
    sellingPrice: Joi.number().required(),
    quantity: Joi.number().required(),
    discount: Joi.number().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    brand: Joi.string().required(),
    isPublic: Joi.boolean().required(),
    productDetails: Joi.string().required(),
    productDescription: Joi.string().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const {
    name,
    originalPrice,
    sellingPrice,
    quantity,
    discount,
    category,
    subCategory,
    brand,
    isPublic,
    productDetails,
    productDescription,
  } = value;
  // check if product already exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Product already exists"));
  }

  const thumbnail = Array.isArray(req.files)
    ? undefined
    : req.files?.thumbnail?.[0];

  if (!thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Thumbnail is required"));
  }
  const thumbnailUrl = await uploadFile(thumbnail, "product");
  const images = Array.isArray(req.files) ? undefined : req.files?.images;
  let imageUrl;
  if (Array.isArray(images) && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      imageUrl = await uploadFile(images[i], "product");
    }
  }

  const product = await Product.create({
    name,
    originalPrice,
    sellingPrice,
    quantity,
    discount,
    category,
    subCategory,
    brand,
    isPublic,
    productDetails,
    productDescription,
    thumbnail: thumbnailUrl,
    images: imageUrl,
  });
  const createdProduct = await Product.findById(product._id);
  if (!createdProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product creation failed"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product._id, "Product created successfully"));
});

const productDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product found successfully"));
});

const allProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

export { createProduct, productDetails, allProducts };
