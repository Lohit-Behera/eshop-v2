import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Layout from "./Layout";
import ProtectedLayout from "./pages/protected/ProtectedLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import HomePage from "@/pages/protected/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import VerifyPage from "@/pages/VerifyPage";
import SessionExpiredPage from "./pages/SessionExpiredPage";

// import protected pages
import ProductPage from "./pages/protected/ProductPage";
import CartPage from "./pages/protected/CartPage";

// import admin pages
import DashboardPage from "@/pages/admin/DashboardPage";
import AddCategory from "./pages/admin/category/AddCategory";
import AllCategoryPage from "./pages/admin/category/AllCategoryPage";
import UpdateCategoryPage from "./pages/admin/category/UpdateCategoryPage";
import AddProductPage from "./pages/admin/product/AddProductPage";
import ProductListPage from "./pages/admin/product/ProductListPage";
import UpdateProductPage from "./pages/admin/product/UpdateProductPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify/:token" element={<VerifyPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      {/* protected routes */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
      {/* admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        {/* Admin Category */}
        <Route path="/admin/category/add" element={<AddCategory />} />
        <Route path="/admin/category" element={<AllCategoryPage />} />
        <Route
          path="/admin/category/update/:categoryId"
          element={<UpdateCategoryPage />}
        />
        {/* Admin Product */}
        <Route path="/admin/product/add" element={<AddProductPage />} />
        <Route path="/admin/product" element={<ProductListPage />} />
        <Route
          path="/admin/product/update/:productId"
          element={<UpdateProductPage />}
        />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
