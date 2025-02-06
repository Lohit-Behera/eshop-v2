import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAllCategories } from "@/feature/categorySlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { Checkbox } from "@/components/ui/checkbox";

function AllCategoryPage() {
  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );
  const fetchAll = useAsyncDispatch(fetchAllCategories);
  useEffect(() => {
    fetchAll();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {categories.map((category) => (
          <div key={category._id} className="grid gap-2 border rounded-md p-4 ">
            <h2>{category.name}</h2>
            <img
              src={category.thumbnail}
              alt=""
              className="w-56 object-cover rounded-md"
            />
            {category.subCategories.map((subCategory, index) => (
              <div
                key={subCategory._id}
                className="p-2 rounded-md bg-muted-foreground/10"
              >
                <div className="flex gap-2">
                  <p>{index + 1}: </p>
                  <h3>{subCategory.name}</h3>
                </div>
                <span className="flex items-center gap-2">
                  Is Public <Checkbox checked={subCategory.isPublic} disabled />
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCategoryPage;
