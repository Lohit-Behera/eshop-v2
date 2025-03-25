import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";

export const fetchCreateBanner = createAsyncThunk(
  "banner/create",
  async (banner: FormData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/banner/create`,
        banner,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while creating the banner";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAllBanners = createAsyncThunk(
  "banner/getAllBanners",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/banner/all`, config);
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while getting all the banners";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchDeleteBanner = createAsyncThunk(
  "banner/delete",
  async (bannerId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/banner/delete/${bannerId}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "Something went wrong while deleting the banner";
      return rejectWithValue(errorMessage);
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    createBanner: {},
    createBannerStatus: "idle",
    createBannerError: {},

    allBanners: { data: [] as any },
    allBannersStatus: "idle",
    allBannersError: {},

    deleteBanner: {},
    deleteBannerStatus: "idle",
    deleteBannerError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateBanner.pending, (state) => {
        state.createBannerStatus = "loading";
      })
      .addCase(fetchCreateBanner.fulfilled, (state, action) => {
        state.createBannerStatus = "succeeded";
        state.createBanner = action.payload;
      })
      .addCase(fetchCreateBanner.rejected, (state, action) => {
        state.createBannerStatus = "failed";
        state.createBannerError =
          action.payload || "Something went wrong while creating the banner";
      })

      // get all
      .addCase(fetchAllBanners.pending, (state) => {
        state.allBannersStatus = "loading";
      })
      .addCase(fetchAllBanners.fulfilled, (state, action) => {
        state.allBannersStatus = "succeeded";
        state.allBanners = action.payload;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.allBannersStatus = "failed";
        state.allBannersError =
          action.payload ||
          "Something went wrong while getting all the banners";
      })

      // delete
      .addCase(fetchDeleteBanner.pending, (state) => {
        state.deleteBannerStatus = "loading";
      })
      .addCase(fetchDeleteBanner.fulfilled, (state, action) => {
        state.deleteBannerStatus = "succeeded";
        state.deleteBanner = action.payload;
      })
      .addCase(fetchDeleteBanner.rejected, (state, action) => {
        state.deleteBannerStatus = "failed";
        state.deleteBannerError =
          action.payload || "Something went wrong while deleting the banner";
      });
  },
});

export default bannerSlice.reducer;
