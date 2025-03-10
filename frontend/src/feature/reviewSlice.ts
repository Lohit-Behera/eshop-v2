import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

// type
export interface Review {
  _id: string;
  rating: number;
  comment: string;
  product: string;
  user: string;
  name: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchCreateReview = createAsyncThunk(
  "review/create",
  async (
    review: {
      productId: string;
      rating: number;
      comment: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/review/create`,
        review,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while creating the review";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetAllReviews = createAsyncThunk(
  "review/getAll",
  async (productId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/review/all/${productId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting all the reviews";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDeleteReview = createAsyncThunk(
  "review/delete",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/review/${reviewId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while deleting the review";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUpdateReview = createAsyncThunk(
  "review/update",
  async (
    review: {
      reviewId: string;
      rating: number;
      comment: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/review/update/${review.reviewId}`,
        review,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while updating the review";
      return rejectWithValue(errorMessage);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    createReview: {},
    createReviewStatus: "idle",
    createReviewError: {},

    getAllReviews: { data: [] as Review[] },
    getAllReviewsStatus: "idle",
    getAllReviewsError: {},

    deleteReview: {},
    deleteReviewStatus: "idle",
    deleteReviewError: {},

    updateReview: {},
    updateReviewStatus: "idle",
    updateReviewError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create review
      .addCase(fetchCreateReview.pending, (state) => {
        state.createReviewStatus = "loading";
      })
      .addCase(fetchCreateReview.fulfilled, (state, action) => {
        state.createReviewStatus = "succeeded";
        state.createReview = action.payload;
      })
      .addCase(fetchCreateReview.rejected, (state, action) => {
        state.createReviewStatus = "failed";
        state.createReviewError =
          action.payload || "Something went wrong while creating the review";
      })
      // get all reviews
      .addCase(fetchGetAllReviews.pending, (state) => {
        state.getAllReviewsStatus = "loading";
      })
      .addCase(fetchGetAllReviews.fulfilled, (state, action) => {
        state.getAllReviewsStatus = "succeeded";
        state.getAllReviews = action.payload;
      })
      .addCase(fetchGetAllReviews.rejected, (state, action) => {
        state.getAllReviewsStatus = "failed";
        state.getAllReviewsError =
          action.payload ||
          "Something went wrong while getting all the reviews";
      })
      // delete review
      .addCase(fetchDeleteReview.pending, (state) => {
        state.deleteReviewStatus = "loading";
      })
      .addCase(fetchDeleteReview.fulfilled, (state, action) => {
        state.deleteReviewStatus = "succeeded";
        state.deleteReview = action.payload;
      })
      .addCase(fetchDeleteReview.rejected, (state, action) => {
        state.deleteReviewStatus = "failed";
        state.deleteReviewError =
          action.payload || "Something went wrong while deleting the review";
      })
      // update review
      .addCase(fetchUpdateReview.pending, (state) => {
        state.updateReviewStatus = "loading";
      })
      .addCase(fetchUpdateReview.fulfilled, (state, action) => {
        state.updateReviewStatus = "succeeded";
        state.updateReview = action.payload;
      })
      .addCase(fetchUpdateReview.rejected, (state, action) => {
        state.updateReviewStatus = "failed";
        state.updateReviewError =
          action.payload || "Something went wrong while updating the review";
      });
  },
});

export default reviewSlice.reducer;
