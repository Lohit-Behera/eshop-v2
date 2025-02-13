import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "@/feature/productSlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "motion/react";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";

function ProductPage() {
  const { productId } = useParams();
  const product = useSelector((state: RootState) => state.product.product.data);
  const productStatus = useSelector(
    (state: RootState) => state.product.productStatus
  );

  const getProduct = useAsyncDispatch(fetchProduct);
  useEffect(() => {
    if (productId) getProduct(productId);
  }, [productId]);
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const increaseQuantity = () =>
    setQuantity((prev) => Math.min(prev + 1, product.quantity));

  return (
    <>
      {productStatus === "loading" ? (
        <p>Loading...</p>
      ) : productStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : productStatus === "succeeded" ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-xl md:text-2xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-xl font-semibold mb-2">
                ₹{product.sellingPrice.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 line-through mb-2">
                ₹{product.originalPrice.toLocaleString()}
              </p>
              <p className="text-lg font-bold text-green-500 mb-4">
                {product.discount}% off
              </p>

              <motion.form
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-2"
                >
                  Quantity
                </Label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="rounded-r-none"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    readOnly
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            Number.parseInt(e.target.value) || 1,
                            product.quantity
                          )
                        )
                      )
                    }
                    className="w-20 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                    min="1"
                    max={product.quantity}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="rounded-l-none"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button className="w-full mb-4">
                  <ShoppingCartIcon className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </motion.div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Product Details</h2>
                <Disclosure className="rounded-md border border-zinc-200 px-3 dark:border-zinc-700">
                  <DisclosureTrigger>
                    <button
                      className="w-full py-2 text-left text-sm"
                      type="button"
                    >
                      Product Details
                    </button>
                  </DisclosureTrigger>
                  <DisclosureContent>
                    <div className="overflow-hidden pb-3">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.productDetails,
                        }}
                        className="prose max-w-none"
                      />
                    </div>
                  </DisclosureContent>
                </Disclosure>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">
                  Product Description
                </h2>
                <Disclosure className="rounded-md border border-zinc-200 px-3 dark:border-zinc-700">
                  <DisclosureTrigger>
                    <button
                      className="w-full py-2 text-left text-sm"
                      type="button"
                    >
                      Product Description
                    </button>
                  </DisclosureTrigger>
                  <DisclosureContent>
                    <div className="overflow-hidden pb-3">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.productDescription,
                        }}
                        className="prose max-w-none"
                      />
                    </div>
                  </DisclosureContent>
                </Disclosure>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProductPage;
