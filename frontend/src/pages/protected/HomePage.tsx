import { fetchAllProducts } from "@/feature/productSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.product.allProducts.data
  );
  const reduxState = useSelector((state) => state); // Get the full Redux state

  const downloadTxtFile = () => {
    const stateString = JSON.stringify(reduxState, null, 2); // Pretty format
    const blob = new Blob([stateString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "redux-state.txt"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);
  return (
    <div>
      <h1 className="text-center text-xl font-bold">Home page</h1>
      <button onClick={downloadTxtFile}>Download Redux State</button>
    </div>
  );
}

export default HomePage;
