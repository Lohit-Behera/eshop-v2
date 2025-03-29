import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";
import { Product } from "./cartSlice";

export interface Order {
  _id: string;
  userId: string;
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
}

interface ProfileOrders extends Order {
  _id: string;
  docs: {
    _id: string;
    products: Product[];
    totalPrice: number;
    shippingPrice: number;
    tax: number;
    grandTotal: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
  }[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null | number;
  nextPage: null | number;
}

interface AdminOrderList {
  _id: string;
  docs: {
    _id: string;
    grandTotal: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
  }[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null | number;
  nextPage: null | number;
}

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

export const fetchProfileOrder = createAsyncThunk(
  "order/profileOrder",
  async (query: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/order/profile?${query}`,
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

export const fetchOrderAdminList = createAsyncThunk(
  "order/orderAdminList",
  async (query: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/order/admin/orders?${query}`,
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

export const fetchUpdateOrder = createAsyncThunk(
  "order/update",
  async (
    order: { orderId: string; status: string; paymentStatus: string },
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
        `${baseUrl}/api/v1/order/admin/update/${order.orderId}`,
        order,
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

export const fetchDeleteOrder = createAsyncThunk(
  "order/delete",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/order/admin/delete/${orderId}`,
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

    profileOrder: { data: {} as ProfileOrders },
    profileOrderStatus: "idle",
    profileOrderError: {},

    orderAdminList: { data: {} as AdminOrderList },
    orderAdminListStatus: "idle",
    orderAdminListError: {},

    updateOrder: {},
    updateOrderStatus: "idle",
    updateOrderError: {},
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
      })

      // profile order
      .addCase(fetchProfileOrder.pending, (state) => {
        state.profileOrderStatus = "loading";
      })
      .addCase(fetchProfileOrder.fulfilled, (state, action) => {
        state.profileOrderStatus = "succeeded";
        state.profileOrder = action.payload;
      })
      .addCase(fetchProfileOrder.rejected, (state, action) => {
        state.profileOrderStatus = "failed";
        state.profileOrderError =
          action.payload || "Something went wrong while getting order";
      })

      // admin order list
      .addCase(fetchOrderAdminList.pending, (state) => {
        state.orderAdminListStatus = "loading";
      })
      .addCase(fetchOrderAdminList.fulfilled, (state, action) => {
        state.orderAdminListStatus = "succeeded";
        state.orderAdminList = action.payload;
      })
      .addCase(fetchOrderAdminList.rejected, (state, action) => {
        state.orderAdminListStatus = "failed";
        state.orderAdminListError =
          action.payload || "Something went wrong while getting order";
      })

      // update order
      .addCase(fetchUpdateOrder.pending, (state) => {
        state.updateOrderStatus = "loading";
      })
      .addCase(fetchUpdateOrder.fulfilled, (state, action) => {
        state.updateOrderStatus = "succeeded";
        state.updateOrder = action.payload;
      })
      .addCase(fetchUpdateOrder.rejected, (state, action) => {
        state.updateOrderStatus = "failed";
        state.updateOrderError =
          action.payload || "Something went wrong while getting order";
      });
  },
});

export default orderSlice.reducer;
