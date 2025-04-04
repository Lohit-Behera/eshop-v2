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
import ProfilePage from "./pages/protected/ProfilePage";
import CheckoutPage from "./pages/protected/CheckoutPage";
import OrderPage from "./pages/protected/OrderPage";
import CategoryPage from "./pages/protected/CategoryPage";
import AllProductPage from "./pages/protected/AllProductPage";

// import admin pages
import DashboardPage from "@/pages/admin/DashboardPage";
import AddCategory from "./pages/admin/category/AddCategory";
import AllCategoryPage from "./pages/admin/category/AllCategoryPage";
import UpdateCategoryPage from "./pages/admin/category/UpdateCategoryPage";
import AddProductPage from "./pages/admin/product/AddProductPage";
import ProductListPage from "./pages/admin/product/ProductListPage";
import UpdateProductPage from "./pages/admin/product/UpdateProductPage";
import AddBannerPage from "./pages/admin/banner/AddBannerPage";
import BannerPage from "./pages/admin/banner/BannerPage";
import OrderAdminPage from "./pages/admin/OrderPage";
import OrderUpdatePage from "./pages/admin/OrderUpdatePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify/:token" element={<VerifyPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/products" element={<AllProductPage />} />
      {/* protected routes */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/order/:orderId" element={<OrderPage />} />
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
        {/* Admin Banner */}
        <Route path="/admin/banner/add" element={<AddBannerPage />} />
        <Route path="/admin/banner" element={<BannerPage />} />
        {/* Admin Order */}
        <Route path="/admin/orders" element={<OrderAdminPage />} />
        <Route
          path="/admin/orders/update/:orderId"
          element={<OrderUpdatePage />}
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
