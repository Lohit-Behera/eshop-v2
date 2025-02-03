import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useLayoutEffect } from "react";
import { fetchUserDetails } from "./feature/userSlice";
import { useAsyncDispatch } from "./hooks/dispatch";

function Layout() {
  const location = useLocation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const fetchDetails = useAsyncDispatch(fetchUserDetails);

  useLayoutEffect(() => {
    if (userInfo) {
      fetchDetails();
    }
  }, [userInfo]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-center items-center">
      {!isAdminRoute && <Header />}
      <main className="w-full flex-1 flex justify-center items-center">
        <ScrollRestoration />
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
