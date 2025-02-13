import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAllProducts } from "@/feature/productSlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useSearchParams } from "react-router-dom";

function ProductListPage() {
  const allProducts = useSelector(
    (state: RootState) => state.product.allProducts.data
  );
  const allProductsStatus = useSelector(
    (state: RootState) => state.product.allProductsStatus
  );
  const fetchProducts = useAsyncDispatch(fetchAllProducts);
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      {allProductsStatus === "loading" ? (
        <p>Loading</p>
      ) : allProductsStatus === "failed" ? (
        <p>Error</p>
      ) : allProductsStatus === "succeeded" ? (
        <DataTable columns={columns} data={allProducts} />
      ) : null}
    </>
  );
}

export default ProductListPage;
