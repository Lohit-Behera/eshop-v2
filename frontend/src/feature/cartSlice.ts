import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

export interface Product {
  productId: string;
  name: string;
  thumbnail: string;
  sellingPrice: number;
  stock: number;
  quantity: number;
  totalPrice: number;
}
interface Cart {
  _id: string;
  userId: string;
  cartId: string;
  totalPrice: number;
  shippingPrice: number;
  tax: number;
  products: Product[];
}

export const fetchAddToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
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
        `${baseUrl}/api/v1/cart/add`,
        { productId, quantity },
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while deleting subcategory";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/cart/get`, config);
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while deleting subcategory";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRemoveFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/cart/remove/${productId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while deleting subcategory";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchChangeQuantity = createAsyncThunk(
  "cart/changeQuantity",
  async (
    { productId, quantity }: { productId: string; quantity: number },
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
        `${baseUrl}/api/v1/cart/update`,
        { productId, quantity },
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred while deleting subcategory";
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    addToCart: {},
    addTOCartStatus: "idle",
    addTOCartError: {},

    getCart: { data: { products: [] as Product[] } as Cart },
    getCartStatus: "idle",
    getCartError: {},

    removeFromCart: {},
    removeFromCartStatus: "idle",
    removeFromCartError: {},

    changeQuantity: {},
    changeQuantityStatus: "idle",
    changeQuantityError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddToCart.pending, (state) => {
        state.addTOCartStatus = "loading";
      })
      .addCase(fetchAddToCart.fulfilled, (state, action) => {
        state.addToCart = action.payload;
        state.addTOCartStatus = "succeeded";
      })
      .addCase(fetchAddToCart.rejected, (state, action) => {
        state.addTOCartStatus = "failed";
        state.addTOCartError =
          action.payload || "Something went wrong while adding to cart";
      })

      // get cart
      .addCase(fetchGetCart.pending, (state) => {
        state.getCartStatus = "loading";
      })
      .addCase(fetchGetCart.fulfilled, (state, action) => {
        state.getCart = action.payload;
        state.getCartStatus = "succeeded";
      })
      .addCase(fetchGetCart.rejected, (state, action) => {
        state.getCartStatus = "failed";
        state.getCartError =
          action.payload || "Something went wrong while getting cart";
      })

      // remove from cart
      .addCase(fetchRemoveFromCart.pending, (state) => {
        state.removeFromCartStatus = "loading";
      })
      .addCase(fetchRemoveFromCart.fulfilled, (state, action) => {
        state.removeFromCart = action.payload;
        state.removeFromCartStatus = "succeeded";
      })
      .addCase(fetchRemoveFromCart.rejected, (state, action) => {
        state.removeFromCartStatus = "failed";
        state.removeFromCartError =
          action.payload || "Something went wrong while removing from cart";
      })

      // change quantity
      .addCase(fetchChangeQuantity.pending, (state) => {
        state.changeQuantityStatus = "loading";
      })
      .addCase(fetchChangeQuantity.fulfilled, (state, action) => {
        state.changeQuantity = action.payload;
        state.changeQuantityStatus = "succeeded";
      })
      .addCase(fetchChangeQuantity.rejected, (state, action) => {
        state.changeQuantityStatus = "failed";
        state.changeQuantityError =
          action.payload || "Something went wrong while changing quantity";
      });
  },
});

export default cartSlice.reducer;
