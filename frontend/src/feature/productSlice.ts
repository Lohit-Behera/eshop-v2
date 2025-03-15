import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

export interface Product {
  _id: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discount: number;
  stock: number;
  category: string;
  subCategory: string;
  brand: string;
  isPublic: boolean;
  productDetails: string;
  productDescription: string;
  thumbnail: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HomeProduct {
  _id: string;
  name: string;
  originalPrice: number;
  sellingPrice: number;
  discount: number;
  stock: number;
  category: string;
  subCategory: string;
  brand: string;
  isPublic: boolean;
  thumbnail: string;
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

export const fetchUpdateProduct = createAsyncThunk(
  "product/update",
  async (product: FormData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/product/update`,
        product,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while updating the product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDeleteProduct = createAsyncThunk(
  "product/delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/product/delete/${productId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while deleting the product";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchHomeProducts = createAsyncThunk(
  "product/homeProducts",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/product/get/home`,
        config
      );
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

    allProducts: { data: [] as Product[] },
    allProductsStatus: "idle",
    allProductsError: {},

    updateProduct: {},
    updateProductStatus: "idle",
    updateProductError: {},

    deleteProduct: {},
    deleteProductStatus: "idle",
    deleteProductError: {},

    homeProducts: { data: [] as HomeProduct[] },
    homeProductsStatus: "idle",
    homeProductsError: {},
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
      })
      // update product
      .addCase(fetchUpdateProduct.pending, (state) => {
        state.updateProductStatus = "loading";
      })
      .addCase(fetchUpdateProduct.fulfilled, (state, action) => {
        state.updateProductStatus = "succeeded";
        state.updateProduct = action.payload;
      })
      .addCase(fetchUpdateProduct.rejected, (state, action) => {
        state.updateProductStatus = "failed";
        state.updateProductError =
          action.payload || "Something went wrong while updating the product";
      })
      // delete product
      .addCase(fetchDeleteProduct.pending, (state) => {
        state.deleteProductStatus = "loading";
      })
      .addCase(fetchDeleteProduct.fulfilled, (state, action) => {
        state.deleteProductStatus = "succeeded";
        state.deleteProduct = action.payload;
      })
      .addCase(fetchDeleteProduct.rejected, (state, action) => {
        state.deleteProductStatus = "failed";
        state.deleteProductError =
          action.payload || "Something went wrong while deleting the product";
      })

      // home products
      .addCase(fetchHomeProducts.pending, (state) => {
        state.homeProductsStatus = "loading";
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.homeProductsStatus = "succeeded";
        state.homeProducts = action.payload;
      })
      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.homeProductsStatus = "failed";
        state.homeProductsError =
          action.payload ||
          "Something went wrong while getting all the products";
      });
  },
});

export default productSlice.reducer;
