import { useState } from "react";
import { motion } from "framer-motion";
import { CategoryCard } from "@/components/category-card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
function CategoryPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const categories = useSelector(
    (state: RootState) => state.category.getAllCategories.data
  );
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {categories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          isExpanded={expandedCategory === category._id}
          onToggle={() =>
            setExpandedCategory(
              expandedCategory === category._id ? null : category._id
            )
          }
        />
      ))}
    </motion.div>
  );
}

export default CategoryPage;
