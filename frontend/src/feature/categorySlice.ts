import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

// type
export interface Category {
  _id: string;
  name: string;
  isPublic: boolean;
  thumbnail: string;
  subCategories: { _id: string; name: string; isPublic: boolean }[];
}

export const fetchAddCategory = createAsyncThunk(
  "category/addCategory",
  async (
    category: {
      name: string;
      isPublic: boolean;
      thumbnail: File;
      subCategories: { name: string; isPublic: boolean }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/category/add`,
        category,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while adding category";
      return rejectWithValue(errorMessage);
    }
  }
);

// get all categories
export const fetchAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/category/get/all`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while getting categories";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetCategory = createAsyncThunk(
  "category/getCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/category/${categoryId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while getting category";
      return rejectWithValue(errorMessage);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    addCategory: {},
    addCategoryStatus: "idle",
    addCategoryError: {},

    getAllCategories: { data: [] as Category[] },
    getAllCategoriesStatus: "idle",
    getAllCategoriesError: {},

    getCategory: { data: {} as Category },
    getCategoryStatus: "idle",
    getCategoryError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add category
      .addCase(fetchAddCategory.pending, (state) => {
        state.addCategoryStatus = "loading";
      })
      .addCase(fetchAddCategory.fulfilled, (state, action) => {
        state.addCategoryStatus = "succeeded";
        state.addCategory = action.payload;
      })
      .addCase(fetchAddCategory.rejected, (state, action) => {
        state.addCategoryStatus = "failed";
        state.addCategoryError = action.error;
      })

      // get all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.getAllCategoriesStatus = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.getAllCategoriesStatus = "succeeded";
        state.getAllCategories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.getAllCategoriesStatus = "failed";
        state.getAllCategoriesError = action.error;
      })

      // get category
      .addCase(fetchGetCategory.pending, (state) => {
        state.getCategoryStatus = "loading";
      })
      .addCase(fetchGetCategory.fulfilled, (state, action) => {
        state.getCategoryStatus = "succeeded";
        state.getCategory = action.payload;
      })
      .addCase(fetchGetCategory.rejected, (state, action) => {
        state.getCategoryStatus = "failed";
        state.getCategoryError = action.error;
      });
  },
});

export default categorySlice.reducer;
