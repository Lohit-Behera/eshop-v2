import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLayoutEffect } from "react";

function ProtectedLayout() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useLayoutEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  return <>{userInfo ? <Outlet /> : null}</>;
}

export default ProtectedLayout;
