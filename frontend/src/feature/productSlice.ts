import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

interface Product {
  _id: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discount: number;
  quantity: number;
  category: string;
  subCategory: string;
  brand: string;
  isPublic: boolean;
  productDetails: string;
  productDescription: string;
  thumbnail: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const fetchCreateProduct = createAsyncThunk(
  "product/createProduct",
  async (product: FormData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/product/create`,
        product,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while creating the product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "product/getProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/product/${productId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting the product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/product/all`, config);
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting all the products";
      return rejectWithValue(errorMessage);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    createProduct: {},
    createProductStatus: "idle",
    createProductError: {},

    product: { data: {} as Product },
    productStatus: "idle",
    productError: {},

    allProducts: {},
    allProductsStatus: "idle",
    allProductsError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(fetchCreateProduct.pending, (state) => {
        state.createProductStatus = "loading";
      })
      .addCase(fetchCreateProduct.fulfilled, (state, action) => {
        state.createProductStatus = "succeeded";
        state.createProduct = action.payload;
      })
      .addCase(fetchCreateProduct.rejected, (state, action) => {
        state.createProductStatus = "failed";
        state.createProductError =
          action.payload || "Something went wrong while creating the product";
      })
      // get product
      .addCase(fetchProduct.pending, (state) => {
        state.productStatus = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productStatus = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.productStatus = "failed";
        state.productError =
          action.payload || "Something went wrong while getting the product";
      })
      // get all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsStatus = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsStatus = "succeeded";
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allProductsStatus = "failed";
        state.allProductsError =
          action.payload ||
          "Something went wrong while getting all the products";
      });
  },
});

export default productSlice.reducer;
