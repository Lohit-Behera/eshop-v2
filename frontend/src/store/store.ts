import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/feature/authSlice";
import userSlice from "@/feature/userSlice";
import categorySlice from "@/feature/categorySlice";
import productSlice from "@/feature/productSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    category: categorySlice,
    product: productSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
