import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "@/feature/productSlice";
import { useAsyncDispatch, useDispatchWithToast } from "@/hooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "motion/react";
import { Loader2, MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Reviews from "@/components/Reviews";
import { fetchAddToCart } from "@/feature/cartSlice";
import { TextMorph } from "@/components/ui/text-morph";

function ProductPage() {
  const { productId } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [buttonLoading, setButtonLoading] = useState(false);

  const product = useSelector((state: RootState) => state.product.product.data);
  const productStatus = useSelector(
    (state: RootState) => state.product.productStatus
  );

  const getProduct = useAsyncDispatch(fetchProduct);
  useEffect(() => {
    if (productId) getProduct(productId);
  }, [productId]);
  useEffect(() => {
    if (productStatus === "succeeded" && product.name) {
      document.title = product.name;
    }
  }, [productStatus, product]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productStatus === "succeeded") {
      if (product.images.length > 0) {
        setImages([product.thumbnail, ...product.images]);
      }
    }
  }, [productStatus]);

  const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const increaseQuantity = () =>
    setQuantity((prev) => Math.min(prev + 1, product.quantity));

  const addToCart = useDispatchWithToast(fetchAddToCart, {
    loadingMessage: "Adding to cart...",
    getSuccessMessage(data) {
      return data.message || `${product.name} added to cart successfully"`;
    },
    getErrorMessage(error) {
      return (
        error.message || error || "Something went wrong while adding to cart"
      );
    },
    onSuccess: () => {
      setButtonLoading(false);
    },
    onError: () => {
      setButtonLoading(false);
    },
  });

  const handleAddToCart = () => {
    setButtonLoading(true);
    addToCart({ productId: product._id, quantity });
  };

  return (
    <>
      {productStatus === "loading" ? (
        <p>Loading...</p>
      ) : productStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : productStatus === "succeeded" ? (
        <div className="container mx-auto px-4 py-8 grid gap-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              <div className="relative w-full py-8 max-h-[60vh]">
                <Carousel index={index} onIndexChange={setIndex}>
                  <CarouselContent className="relative max-h-[50vh] mb-4">
                    {images.map((item) => {
                      return (
                        <CarouselItem key={item} className="p-4">
                          <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                            <img
                              src={item}
                              alt=""
                              className="pointer-events-none"
                            />
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                </Carousel>
                <div className="flex w-full justify-center space-x-3 px-4">
                  {images.map((item, index) => {
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to slide ${item}`}
                        onClick={() => setIndex(index)}
                        className="h-12 w-12 border border-zinc-200 dark:border-zinc-800"
                      >
                        <img src={item} alt="" />
                      </button>
                    );
                  })}
                </div>
              </div>
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
                <Button className="w-full mb-4" onClick={handleAddToCart}>
                  {buttonLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCartIcon className="h-4 w-4" />
                  )}
                  <TextMorph>
                    {buttonLoading ? "Adding..." : "Add to Cart"}
                  </TextMorph>
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
          <Reviews productId={product._id} />
        </div>
      ) : null}
    </>
  );
}

export default ProductPage;
