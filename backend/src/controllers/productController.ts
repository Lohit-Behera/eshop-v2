import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { IProduct, Product } from "../models/productModel";
import Joi from "joi";
import { uploadFile, deleteFile } from "../utils/cloudinary";
import mongoose from "mongoose";

interface ProductFields {
  name?: string;
  originalPrice?: number;
  sellingPrice?: number;
  stock?: number;
  discount?: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  isPublic?: boolean;
  productDetails?: string;
  productDescription?: string;
}

// create product
const createProduct = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    originalPrice: Joi.number().required(),
    sellingPrice: Joi.number().required(),
    stock: Joi.number().required(),
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
    stock,
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
  let imageUrls: string[] = [];
  if (req.files && !Array.isArray(req.files) && req.files.images) {
    const images = req.files.images;
    if (Array.isArray(images) && images.length > 0) {
      // Use Promise.all for parallel uploads and wait for all to complete
      const uploadPromises = images.map((image) =>
        uploadFile(image, "product")
      );
      const results = await Promise.all(uploadPromises);

      // Filter out any failed uploads (undefined results)
      results.forEach((url) => {
        if (url) imageUrls.push(url);
      });
    }
  }

  const product = await Product.create({
    name,
    originalPrice,
    sellingPrice,
    stock,
    discount,
    category,
    subCategory,
    brand,
    isPublic,
    productDetails,
    productDescription,
    thumbnail: thumbnailUrl,
    images: imageUrls,
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

const updateProduct = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    productId: Joi.string().optional(),
    name: Joi.string().min(3).optional(),
    originalPrice: Joi.number().optional(),
    sellingPrice: Joi.number().optional(),
    stock: Joi.number().optional(),
    discount: Joi.number().optional(),
    category: Joi.string().optional(),
    subCategory: Joi.string().optional(),
    brand: Joi.string().optional(),
    isPublic: Joi.boolean().optional(),
    productDetails: Joi.string().optional(),
    productDescription: Joi.string().optional(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  const product = await Product.findById(value.productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }

  const fieldsToUpdate: (keyof ProductFields)[] = [
    "name",
    "originalPrice",
    "sellingPrice",
    "stock",
    "discount",
    "category",
    "subCategory",
    "brand",
    "isPublic",
    "productDetails",
    "productDescription",
  ];
  const updates: Partial<IProduct> = {};
  let hasUpdates = false;

  fieldsToUpdate.forEach((field) => {
    if (value[field] !== undefined && value[field] !== product.get(field)) {
      updates[field] = value[field];
      hasUpdates = true;
    }
  });

  const thumbnail = Array.isArray(req.files)
    ? undefined
    : req.files?.thumbnail?.[0];

  if (thumbnail) {
    if (!thumbnail.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "File is not an image"));
    }
    // upload thumbnail to cloudinary
    const thumbnailUrl = await uploadFile(thumbnail, "product");
    if (!thumbnailUrl) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Error uploading thumbnail"));
    }
    // delete thumbnail from cloudinary
    if (product.thumbnail) {
      await deleteFile(product.thumbnail, "eshop/product", res);
    }
    updates.thumbnail = thumbnailUrl;
    hasUpdates = true;
  }

  if (req.files && !Array.isArray(req.files) && req.files.images) {
    const images = req.files.images;
    if (Array.isArray(images) && images.length > 0) {
      const imageUrls: string[] = [];

      // Use Promise.all for parallel uploads and wait for all to complete
      const uploadPromises = images.map((image) =>
        uploadFile(image, "product")
      );
      const results = await Promise.all(uploadPromises);

      // Filter out any failed uploads (undefined results)
      results.forEach((url) => {
        if (url) imageUrls.push(url);
      });

      if (imageUrls.length > 0) {
        // Delete old images if they exist
        if (product.images && product.images.length > 0) {
          await Promise.all(
            product.images.map((img) => deleteFile(img, "eshop/product", res))
          );
        }

        updates.images = imageUrls;
        hasUpdates = true;
      }
    }
  }

  // Apply updates if there are any
  if (hasUpdates) {
    await Product.updateOne({ _id: value.productId }, { $set: updates });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product updated successfully"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "No updates were made to the product"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  if (product.thumbnail) {
    await deleteFile(product.thumbnail, "eshop/product", res);
  }
  if (product.images) {
    for (let i = 0; i < product.images.length; i++) {
      await deleteFile(product.images[i], "eshop/product", res);
    }
  }
  await Product.findByIdAndDelete(productId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

const homeProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(12)
    .select(
      "_id name originalPrice sellingPrice thumbnail discount category subCategory brand isPublic, stock"
    );
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

const uniqueBrands = asyncHandler(async (req, res) => {
  const products = await Product.find().distinct("brand");
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    brand,
    priceMin,
    priceMax,
    stock,
    discount,
    sort,
    subCategory,
  } = req.query;

  // Build match conditions for the aggregation
  const matchConditions: any = { isPublic: true };

  // Apply search filter if provided
  if (search) {
    matchConditions.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  // Apply category filter (handle multiple categories)
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    matchConditions.category = { $in: categories };
  }

  // Apply subCategory filter (handle multiple subCategories)
  if (subCategory) {
    const subCategories = Array.isArray(subCategory)
      ? subCategory
      : [subCategory];
    matchConditions.subCategory = { $in: subCategories };
  }

  // Apply brand filter (handle multiple brands)
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand];
    matchConditions.brand = { $in: brands };
  }

  // Apply price range filter
  if (priceMin || priceMax) {
    matchConditions.sellingPrice = {};

    if (priceMin) {
      matchConditions.sellingPrice.$gte = Number(priceMin);
    }

    if (priceMax) {
      matchConditions.sellingPrice.$lte = Number(priceMax);
    }
  }

  // Apply stock filter
  if (stock === "in-stock") {
    matchConditions.stock = { $gt: 0 };
  } else if (stock === "out-of-stock") {
    matchConditions.stock = { $lte: 0 };
  }

  // Apply discount filter
  if (discount) {
    matchConditions.discount = { $gte: Number(discount) };
  }

  // Create the aggregation pipeline
  const pipeline: mongoose.PipelineStage[] = [
    { $match: matchConditions },
    {
      $project: {
        _id: 1,
        name: 1,
        originalPrice: 1,
        sellingPrice: 1,
        discount: 1,
        category: 1,
        subCategory: 1,
        brand: 1,
        thumbnail: 1,
        stock: 1,
      },
    },
  ];

  // Apply sorting
  if (sort) {
    switch (sort) {
      case "price-low-high":
        pipeline.push({ $sort: { sellingPrice: 1 } });
        break;
      case "price-high-low":
        pipeline.push({ $sort: { sellingPrice: -1 } });
        break;
      case "discount":
        pipeline.push({ $sort: { discount: -1 } });
        break;
      case "newest":
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
      default:
        // Default sorting (featured)
        pipeline.push({ $sort: { _id: -1 } });
    }
  } else {
    // Default sorting if not specified
    pipeline.push({ $sort: { _id: -1 } });
  }

  // Execute the aggregation
  const products = await Product.aggregatePaginate(pipeline);

  if (!products || products.docs.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(404, products, "Products found successfully"));
});

export {
  createProduct,
  productDetails,
  allProducts,
  updateProduct,
  deleteProduct,
  homeProducts,
  uniqueBrands,
  getFilteredProducts,
};
