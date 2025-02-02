import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/lib/proxy";
import { getCookie } from "@/lib/getCookie";

export const fetchSignUp = createAsyncThunk(
  "auth/signUp",
  async (
    user: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
      avatar: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/auth/signup`,
        user,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLogIn = createAsyncThunk(
  "auth/logIn",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/auth/login`,
        user,
        config
      );
      document.cookie = `userInfoEShop=${encodeURIComponent(
        JSON.stringify(data.data)
      )}; path=/; max-age=${60 * 24 * 60 * 60}; secure; sameSite=None;`;
      return data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLogOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/auth/logout`, config);
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchVerify = createAsyncThunk(
  "auth/verify",
  async (token: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/auth/verify/${token}`,
        config
      );
      return data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message ??
        err.message ??
        "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

const userInfoCookie = getCookie("userInfoEShop");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signUp: {},
    signUpStatus: "idle",
    signUpError: {},

    userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
    userInfoStatus: "idle",
    userInfoError: {},

    logOut: {},
    logOutStatus: "idle",
    logOutError: {},

    verify: {},
    verifyStatus: "idle",
    verifyError: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // sign up
      .addCase(fetchSignUp.pending, (state) => {
        state.signUpStatus = "loading";
      })
      .addCase(fetchSignUp.fulfilled, (state, action) => {
        state.signUpStatus = "succeeded";
        state.signUp = action.payload;
      })
      .addCase(fetchSignUp.rejected, (state, action) => {
        state.signUpStatus = "failed";
        state.signUpError =
          action.payload || "Something went wrong while creating account";
      })

      // user info
      .addCase(fetchLogIn.pending, (state) => {
        state.userInfoStatus = "loading";
      })
      .addCase(fetchLogIn.fulfilled, (state, action) => {
        state.userInfoStatus = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchLogIn.rejected, (state, action) => {
        state.userInfoStatus = "failed";
        state.userInfoError =
          action.payload || "Something went wrong while logging in";
      })

      // log out
      .addCase(fetchLogOut.pending, (state) => {
        state.logOutStatus = "loading";
      })
      .addCase(fetchLogOut.fulfilled, (state, action) => {
        state.logOutStatus = "succeeded";
        state.logOut = action.payload;
        state.userInfo = null;
      })
      .addCase(fetchLogOut.rejected, (state, action) => {
        state.logOutStatus = "failed";
        state.logOutError =
          action.payload || "Something went wrong while logging out";
      })

      // verify
      .addCase(fetchVerify.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(fetchVerify.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.verify = action.payload;
      })
      .addCase(fetchVerify.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.verifyError =
          action.payload || "Something went wrong while verifying";
      });
  },
});

export default authSlice.reducer;
