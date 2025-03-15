import { motion } from "framer-motion";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeProduct } from "@/feature/productSlice";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { fetchAddToCart } from "@/feature/cartSlice";
import { useState } from "react";
import { TextMorph } from "./ui/text-morph";

interface ProductCardProps {
  product: HomeProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);

  const addToCart = useDispatchWithToast(fetchAddToCart, {
    loadingMessage: "Adding to cart...",
    getSuccessMessage(data) {
      return (
        data.message ||
        `${
          product.name.length > 20
            ? product.name.slice(0, 20) + "..."
            : product.name.slice(0, 20)
        } added to cart successfully"`
      );
    },
    getErrorMessage(error) {
      return (
        error.message || error || "Something went wrong while adding to cart"
      );
    },
    onSuccess: () => {
      setButtonLoading(null);
    },
    onError: () => {
      setButtonLoading(null);
    },
  });

  const handleAddToCart = (id: string) => {
    setButtonLoading(id);
    addToCart({ productId: id, quantity: 1 });
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.thumbnail || "/placeholder.svg"}
              alt={product.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
          {product.discount > 0 && (
            <Badge className="absolute right-2 top-2 bg-red-600 text-white hover:bg-red-700 cursor-default">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            {product.brand}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-tight hover:underline underline-offset-2">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-green-600">
                In Stock ({product.stock} left)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full gap-2"
            disabled={product.stock === 0 || buttonLoading === product._id}
            size={"sm"}
            onClick={() => {
              handleAddToCart(product._id);
            }}
          >
            {buttonLoading === product._id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            <TextMorph>
              {buttonLoading === product._id ? "Adding..." : "Add to Cart"}
            </TextMorph>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
