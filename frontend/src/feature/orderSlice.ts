import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";
import { Product } from "./cartSlice";

export type Order = {
  _id: string;
  user: string;
  products: Product[];
  shippingAddress: {
    _id: string;
    name: string;
    type: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phone: string;
  };
  totalPrice: number;
  shippingPrice: number;
  tax: number;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: "Razorpay" | "PayPal" | "Stripe";
  razorpay?: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const fetchRazorpayOrderPlaced = createAsyncThunk(
  "order/razorpayOrderPlaced",
  async (
    orderDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      orderId: string;
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
        `${baseUrl}/api/v1/order/placed/razorpay`,
        orderDetails,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting order";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGetOrder = createAsyncThunk(
  "order/getOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/order/get/${orderId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting order";
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: { data: {} as Order },
    orderStatus: "idle",
    orderError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchGetOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchGetOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError =
          action.payload || "Something went wrong while getting order";
      });
  },
});

export default orderSlice.reducer;
