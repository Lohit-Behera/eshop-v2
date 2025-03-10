import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, MoreVertical, Trash, Edit, X, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Label } from "./ui/label";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import {
  fetchCreateReview,
  fetchDeleteReview,
  fetchGetAllReviews,
  fetchUpdateReview,
} from "@/feature/reviewSlice";
import { TextMorph } from "./ui/text-morph";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Review } from "@/feature/reviewSlice";

export default function Reviews({ productId }: { productId: string }) {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const reviews = useSelector(
    (state: RootState) => state.review.getAllReviews.data
  );
  // State for the new review form
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  // State to track if the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for editing a review
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  // State for delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // Handle star rating selection
  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const getReviews = useAsyncDispatch(fetchGetAllReviews);

  useEffect(() => {
    if (reviews.length === 0) {
      getReviews(productId);
    }
  }, [getReviews, productId]);

  const createReview = useDispatchWithToast(fetchCreateReview, {
    loadingMessage: "Creating review...",
    getSuccessMessage(data) {
      return data.message || "Review created successfully";
    },
    getErrorMessage(error) {
      return (
        error.message ||
        error ||
        "Something went wrong while creating the review"
      );
    },
    onSuccess() {
      setNewReview({
        rating: 0,
        comment: "",
      });
      getReviews(productId);
      setIsSubmitting(false);
    },
    onError() {
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    createReview({
      productId,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  const startEditing = (review: Review) => {
    setEditingReview(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingReview(null);
  };

  const updateReview = useDispatchWithToast(fetchUpdateReview, {
    loadingMessage: "Updating review...",
    getSuccessMessage(data) {
      return data.message || "Review updated successfully";
    },
    getErrorMessage(error) {
      return (
        error.message ||
        error ||
        "Something went wrong while updating the review"
      );
    },
    onSuccess() {
      getReviews(productId);
      setEditingReview(null);
    },
  });

  // Save edited review
  const saveEditedReview = (reviewId: string) => {
    updateReview({
      reviewId,
      rating: editedRating,
      comment: editedComment,
    });
  };

  // Open delete confirmation
  const confirmDelete = (id: string) => {
    setReviewToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteReviewFetch = useDispatchWithToast(fetchDeleteReview, {
    loadingMessage: "Deleting review...",
    getSuccessMessage(data) {
      return data.message || "Review deleted successfully";
    },
    getErrorMessage(error) {
      return (
        error.message ||
        error ||
        "Something went wrong while deleting the review"
      );
    },
    onSuccess() {
      getReviews(productId);
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    },
  });

  // Delete a review
  const deleteReview = () => {
    if (reviewToDelete) {
      deleteReviewFetch(reviewToDelete);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
        <div className="flex items-center gap-2 mb-8">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  reviews.length > 0
                    ? star <=
                      Math.round(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      )
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {reviews.length > 0
              ? `${(
                  reviews.reduce((acc, review) => acc + review.rating, 0) /
                  reviews.length
                ).toFixed(1)} out of 5 • ${reviews.length} ${
                  reviews.length === 1 ? "review" : "reviews"
                }`
              : "No reviews yet"}
          </span>
        </div>
      </motion.div>
      {userInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-lg p-6 shadow-sm mb-10 border"
        >
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newReview.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="comment"
                className="block text-sm font-medium mb-1"
              >
                Your Review
              </Label>
              <Textarea
                id="comment"
                value={newReview.comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this product..."
                required
                className="w-full min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={
                isSubmitting || !newReview.comment || newReview.rating === 0
              }
              className="w-full sm:w-auto"
            >
              <TextMorph>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </TextMorph>
            </Button>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-6">Customer Feedback</h3>

        <AnimatePresence>
          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 text-muted-foreground"
            >
              No reviews yet. Be the first to share your experience!
            </motion.div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-background rounded-lg p-6 border"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      {review.avatar ? (
                        <AvatarImage src={review.avatar} alt={review.name} />
                      ) : (
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex items-center gap-2">
                          <time className="text-sm text-muted-foreground">
                            {review.createdAt}
                          </time>
                          {userInfo && userInfo._id === review.user && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => startEditing(review)}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit Review</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 text-destructive cursor-pointer"
                                  onClick={() => confirmDelete(review._id)}
                                >
                                  <Trash className="h-4 w-4" />
                                  <span>Delete Review</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      {editingReview === review._id ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.button
                                key={star}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditedRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= editedRating
                                      ? "fill-primary text-primary"
                                      : "fill-muted text-muted-foreground"
                                  }`}
                                />
                              </motion.button>
                            ))}
                          </div>

                          <Textarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="w-full min-h-[80px] text-sm"
                          />

                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              className="flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEditedReview(review._id)}
                              className="flex items-center gap-1"
                              disabled={!editedComment.trim()}
                            >
                              <Check className="h-4 w-4" />
                              Save
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? "fill-primary text-primary"
                                    : "fill-muted text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
