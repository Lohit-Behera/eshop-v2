import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Category } from "../models/categoryModel";
import Joi from "joi";
import { uploadFile, deleteFile } from "../utils/cloudinary";
import { ICategory } from "../models/categoryModel";

const createCategory = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isPublic: Joi.boolean().required(),
    subCategories: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().min(3).max(50).required(),
          isPublic: Joi.boolean().required(),
        })
      )
      .min(1)
      .required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const { name, isPublic, subCategories } = value;
  // check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Category already exists"));
  }

  // get thumbnail from the request
  const thumbnail = req.file;
  if (!thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Thumbnail is required"));
  }
  if (!thumbnail.mimetype.startsWith("image/")) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "File is not an image"));
  }
  // upload thumbnail to cloudinary
  const thumbnailUrl = await uploadFile(thumbnail, "category");
  if (!thumbnailUrl) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error uploading thumbnail"));
  }

  // create category
  const category = await Category.create({
    name,
    isPublic,
    thumbnail: thumbnailUrl,
    subCategories,
  });
  // validate the category
  const createdCategory = await Category.findById(category._id);
  if (!createdCategory) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Something went wrong while adding category")
      );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdCategory, "Category created successfully")
    );
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category found successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  if (!categories) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Categories not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories found successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  // get category id from the params
  const { categoryId } = req.params;
  // get the category
  const category = await Category.findById(categoryId);
  // validate the category
  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found"));
  }
  // delete thumbnail from cloudinary
  if (category.thumbnail) {
    await deleteFile(category.thumbnail, "eshop/category", res);
  }
  // delete the blog
  await Category.findByIdAndDelete(category._id);
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  // Check if subCategories is a string and parse it
  if (req.body.subCategories && typeof req.body.subCategories === "string") {
    req.body.subCategories = JSON.parse(req.body.subCategories);
  }

  // Schema for validation
  const schema = Joi.object({
    categoryId: Joi.string(),
    name: Joi.string().min(3).max(50).optional(),
    isPublic: Joi.boolean().optional(),
    subCategories: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().min(3).max(50).required(),
          isPublic: Joi.boolean().required(),
          _id: Joi.string().optional(),
        })
      )
      .min(1)
      .optional(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // Get category using ID from params
  const category = await Category.findById(value.categoryId);

  // Validate the category
  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found"));
  }

  let hasUpdates = false;

  // Process thumbnail if provided
  const thumbnail = req.file;
  if (thumbnail) {
    if (!thumbnail.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "File is not an image"));
    }

    // Upload thumbnail to cloudinary
    const thumbnailUrl = await uploadFile(thumbnail, "category");
    if (!thumbnailUrl) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Error uploading thumbnail"));
    }

    // Delete old thumbnail from cloudinary if it exists
    if (category.thumbnail) {
      await deleteFile(category.thumbnail, "eshop/category", res);
    }

    category.thumbnail = thumbnailUrl;
    hasUpdates = true;
  }

  // Update name if provided and different
  if (value.name !== undefined && value.name !== category.name) {
    category.name = value.name;
    hasUpdates = true;
  }

  // Update isPublic if provided and different
  if (value.isPublic !== undefined && value.isPublic !== category.isPublic) {
    category.isPublic = value.isPublic;
    hasUpdates = true;
  }

  // Update subCategories if provided and different
  if (value.subCategories !== undefined) {
    // Deep comparison not possible with stringify due to potential _id fields
    // Instead, we'll set it and mark as updated
    category.subCategories = value.subCategories;
    hasUpdates = true;
  }

  if (!hasUpdates) {
    return res.status(400).json(new ApiResponse(400, null, "No updates found"));
  }

  // Save the updated category
  await category.save({ validateBeforeSave: false });

  // Return updated category
  const updatedCategory = await Category.findById(category._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCategory,
        `${category.name} updated successfully`
      )
    );
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, subCategoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Category not found"));
  }
  const subCategory = category.subCategories.find(
    (sub) => sub._id.toString() === subCategoryId
  );
  if (!subCategory) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "SubCategory not found"));
  }
  category.subCategories = category.subCategories.filter(
    (sub) => sub._id.toString() !== subCategoryId
  );
  await category.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(200, null, `${subCategory.name} deleted successfully`)
    );
});

export {
  createCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  deleteSubCategory,
};
