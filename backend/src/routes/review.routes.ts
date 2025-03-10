import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../controllers/reviewController";

const reviewRouter = Router();

reviewRouter.post("/create", authMiddleware, createReview);
reviewRouter.get("/all/:productId", authMiddleware, getAllReviews);
reviewRouter.delete("/delete/:reviewId", authMiddleware, deleteReview);
reviewRouter.patch("/update/:reviewId", authMiddleware, updateReview);

export default reviewRouter;
