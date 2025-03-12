import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

export interface Address {
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchCreateAddress = createAsyncThunk(
  "address/create",
  async (
    address: {
      name: string;
      type: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
      phone: string;
      isDefault: boolean;
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
        `${baseUrl}/api/v1/address/create`,
        address,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while creating address";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "address/all",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/address/all`, config);
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting all the addresses";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUpdateAddress = createAsyncThunk(
  "address/update",
  async (
    address: {
      addressId: string;
      name: string;
      type: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
      phone: string;
      isDefault: boolean;
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
        `${baseUrl}/api/v1/address/update`,
        address,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while updating address";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDeleteAddress = createAsyncThunk(
  "address/delete",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/address/delete/${addressId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while deleting address";
      return rejectWithValue(errorMessage);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    createAddress: {},
    createAddressStatus: "idle",
    createAddressError: {},
    allAddresses: { data: [] as Address[] },
    allAddressesStatus: "idle",
    allAddressesError: {},
    updateAddress: {},
    updateAddressStatus: "idle",
    updateAddressError: {},
    deleteAddress: {},
    deleteAddressStatus: "idle",
    deleteAddressError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateAddress.pending, (state) => {
        state.createAddressStatus = "loading";
      })
      .addCase(fetchCreateAddress.fulfilled, (state, action) => {
        state.createAddressStatus = "succeeded";
        state.createAddress = action.payload;
      })
      .addCase(fetchCreateAddress.rejected, (state, action) => {
        state.createAddressStatus = "failed";
        state.createAddressError =
          action.payload || "Something went wrong while creating address";
      })
      // get all addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.allAddressesStatus = "loading";
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.allAddressesStatus = "succeeded";
        state.allAddresses = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.allAddressesStatus = "failed";
        state.allAddressesError =
          action.payload ||
          "Something went wrong while getting all the addresses";
      })
      // update address
      .addCase(fetchUpdateAddress.pending, (state) => {
        state.updateAddressStatus = "loading";
      })
      .addCase(fetchUpdateAddress.fulfilled, (state, action) => {
        state.updateAddressStatus = "succeeded";
        state.updateAddress = action.payload;
      })
      .addCase(fetchUpdateAddress.rejected, (state, action) => {
        state.updateAddressStatus = "failed";
        state.updateAddressError =
          action.payload || "Something went wrong while updating address";
      })
      // delete address
      .addCase(fetchDeleteAddress.pending, (state) => {
        state.deleteAddressStatus = "loading";
      })
      .addCase(fetchDeleteAddress.fulfilled, (state, action) => {
        state.deleteAddressStatus = "succeeded";
        state.deleteAddress = action.payload;
      })
      .addCase(fetchDeleteAddress.rejected, (state, action) => {
        state.deleteAddressStatus = "failed";
        state.deleteAddressError =
          action.payload || "Something went wrong while deleting address";
      });
  },
});

export default addressSlice.reducer;
