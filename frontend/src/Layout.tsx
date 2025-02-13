import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useLayoutEffect } from "react";
import { fetchUserDetails } from "./feature/userSlice";
import { fetchAllCategories } from "./feature/categorySlice";
import { useAsyncDispatch } from "./hooks/dispatch";

function Layout() {
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const fetchDetails = useAsyncDispatch(fetchUserDetails);
  const fetchCategories = useAsyncDispatch(fetchAllCategories);
  const userDetailsStatus = useSelector(
    (state: RootState) => state.user.userDetailsStatus
  );
  const getAllCategoriesStatus = useSelector(
    (state: RootState) => state.category.getAllCategoriesStatus
  );

  useLayoutEffect(() => {
    if (userInfo) {
      fetchDetails();
    }
  }, [userInfo]);

  useLayoutEffect(() => {
    fetchCategories();
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-center items-center">
      {userDetailsStatus === "loading" ||
      getAllCategoriesStatus === "loading" ? (
        <div>Loading...</div>
      ) : userDetailsStatus === "failed" ||
        getAllCategoriesStatus === "failed" ? (
        <div>Failed to fetch user details or categories</div>
      ) : (
        <>
          {!isAdminRoute && <Header />}
          <main className="w-full flex-1 flex justify-center items-center">
            <ScrollRestoration />
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
}

export default Layout;
