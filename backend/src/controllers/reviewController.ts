import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Review } from "../models/reviewModel";
import { Product } from "../models/productModel";
import { User } from "../models/userModel";
import Joi from "joi";
import mongoose from "mongoose";

const createReview = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
    productId: Joi.string().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const { rating, comment, productId } = value;
  // check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }

  // check if user exists
  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  // create review
  const review = await Review.create({
    user: user._id,
    product: productId,
    rating,
    comment,
  });
  if (!review) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create review"));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, null, "Review created successfully"));
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        product: 1,
        user: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        updatedAt: 1,
        name: "$userDetails.fullName",
        avatar: "$userDetails.avatar",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  if (!reviews || reviews.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews found successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json(new ApiResponse(404, null, "Review not found"));
  }
  if (review.user.toString() !== req.user?._id.toString()) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          null,
          "You are not authorized to delete this review"
        )
      );
  }
  await Review.findByIdAndDelete(reviewId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json(new ApiResponse(404, null, "Review not found"));
  }
  if (review.user.toString() !== req.user?._id.toString()) {
    return res
      .status(401)
      .json(
        new ApiResponse(
          401,
          null,
          "You are not authorized to update this review"
        )
      );
  }
  // joi schema for validation
  const schema = Joi.object({
    reviewId: Joi.string().required(),
    rating: Joi.number().optional(),
    comment: Joi.string().optional(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const { rating, comment } = value;
  review.rating = rating;
  review.comment = comment;
  await review.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review updated successfully"));
});

export { createReview, getAllReviews, deleteReview, updateReview };
