import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
function AdminLayout() {
  const navigate = useNavigate();
  const userDetails = useSelector((state: RootState) => state.user.userDetails);

  useEffect(() => {
    if (userDetails && userDetails?.role !== "admin") {
      navigate("/");
    }
  }, [userDetails]);

  return (
    <>
      {userDetails ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
              <nav className="flex justify-between space-x-2">
                <SidebarTrigger />
              </nav>
            </header>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      ) : null}
    </>
  );
}
export default AdminLayout;
