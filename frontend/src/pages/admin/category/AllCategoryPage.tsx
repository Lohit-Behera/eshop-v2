import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useSearchParams } from "react-router-dom";

function AllCategoryPage() {
  const searchParams = useSearchParams();
  const search = searchParams[0].get("search");
  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );
  const getAllCategoriesStatus = useSelector(
    (state: RootState) => state.category.getAllCategoriesStatus
  );

  return (
    <>
      {getAllCategoriesStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllCategoriesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesStatus === "succeeded" ? (
        <DataTable columns={columns} data={categories} search={search || ""} />
      ) : null}
    </>
  );
}

export default AllCategoryPage;
