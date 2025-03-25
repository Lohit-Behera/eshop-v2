import { useEffect } from "react";
import { fetchAllBanners } from "@/feature/bannerSlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
function BannerPage() {
  const allBanners = useSelector(
    (state: RootState) => state.banner.allBanners.data
  );
  const allBannersStatus = useSelector(
    (state: RootState) => state.banner.allBannersStatus
  );
  const allBannersError = useSelector(
    (state: RootState) => state.banner.allBannersError
  );
  const banner = useAsyncDispatch(fetchAllBanners);
  useEffect(() => {
    banner();
  }, []);
  return (
    <>
      {allBannersStatus === "loading" ? (
        <p>Loading</p>
      ) : allBannersError === "Banners not found" ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="text-lg md:text-2xl font-semibold">
            No Banners Found
          </h3>
          <Button asChild variant="secondary" size="sm">
            <Link to="/admin/banner/add">Add Banner</Link>
          </Button>
        </div>
      ) : allBannersStatus === "failed" ? (
        <p>Error</p>
      ) : allBannersStatus === "succeeded" ? (
        <DataTable columns={columns} data={allBanners} />
      ) : null}
    </>
  );
}

export default BannerPage;
