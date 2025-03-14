import { fetchAllProducts } from "@/feature/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.product.allProducts.data
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);

  return (
    <div>
      <h1 className="text-center text-xl font-bold">Home page</h1>
    </div>
  );
}

export default HomePage;
