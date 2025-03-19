import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressiveBlur } from "./ui/progressive-blur";

type SubCategory = {
  name: string;
  isPublic: boolean;
  _id: string;
};

type Category = {
  _id: string;
  name: string;
  thumbnail: string;
  isPublic: boolean;
  subCategories: SubCategory[];
};

interface CategoryCardProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const subCategoryVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export function CategoryCard({
  category,
  isExpanded,
  onToggle,
}: CategoryCardProps) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-80 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={category.thumbnail || "/placeholder.svg"}
              alt={category.name}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 h-[30%] w-full"
            blurIntensity={2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-xl">{category.name}</h2>
            <p className="text-white/80 text-sm">
              {category.subCategories.length} subcategories
            </p>
          </div>
        </div>

        <CardContent className="flex-grow pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Popular in {category.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-0 h-8 w-8"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          <motion.div
            variants={subCategoryVariants}
            initial="hidden"
            animate={isExpanded ? "visible" : "hidden"}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {category.subCategories.map((subCategory) => (
                <Link
                  to={`/categories/${category._id}/subcategory/${subCategory._id}`}
                  key={subCategory._id}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {subCategory.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <Button asChild variant="outline" className="w-full">
            <Link to={`/products/?category=${category.name}`}>
              Browse All {category.name}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
