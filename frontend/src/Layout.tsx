import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "@/components/Header";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useLayoutEffect } from "react";
import { fetchUserDetails } from "./feature/userSlice";
import { useAsyncDispatch } from "./hooks/dispatch";

function Layout() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const fetchDetails = useAsyncDispatch(fetchUserDetails);
  useLayoutEffect(() => {
    if (userInfo) {
      fetchDetails();
    }
  }, [userInfo]);
  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-center items-center">
      <Header />
      <main className="w-full flex-1 flex justify-center items-center my-6">
        <ScrollRestoration />
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
