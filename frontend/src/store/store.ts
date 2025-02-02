import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/feature/authSlice";
import userSlice from "@/feature/userSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
