import { fetchGetCart } from "@/feature/cartSlice";
import { useAsyncDispatch } from "@/hooks/dispatch";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store/store";

import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.getCart.data);
  const getCart = useAsyncDispatch(fetchGetCart);
  useEffect(() => {
    getCart();
  }, []);
  return (
    <div className="container mx-auto px-4 py-4 md:py-8 ">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
        Your Shopping Cart
      </h1>

      {cart.products.length === 0 ? (
        <div className="text-center py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 md:gap-4"
          >
            <ShoppingCart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
            <h2 className="text-xl md:text-2xl font-semibold">
              Your cart is empty
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                <Separator className="mb-6" />

                <AnimatePresence>
                  {cart.products.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 md:col-span-2">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover w-full h-auto"
                          />
                        </div>
                        <div className="col-span-9 md:col-span-4">
                          <h3 className="font-medium text-sm md:text-base">
                            {item.name}
                          </h3>
                          <div className="flex justify-between items-center mt-1 md:hidden">
                            <span className="text-xs text-muted-foreground">
                              {item.sellingPrice.toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-7 md:col-span-2 flex items-center mt-2 md:mt-0">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center">
                              {item.cartQuantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                        </div>

                        <div className="col-span-5 flex justify-end items-center gap-2 md:col-span-2 md:justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:hidden"
                            //   onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                          <div className="text-right font-medium text-sm md:text-base">
                            {item.totalPrice.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </div>
                        </div>

                        <div className="hidden md:block md:col-span-2 text-right">
                          {item.sellingPrice.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </div>

                        <div className="hidden md:block md:col-span-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            // onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                      {cart.products.indexOf(item) !==
                        cart.products.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between p-4 md:p-6 pt-0">
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="md:size-default"
                >
                  <Link
                    to="/products"
                    className="flex items-center gap-1 md:gap-2 text-sm md:text-base"
                  >
                    <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {cart.totalPrice.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {cart.shippingPrice.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>
                      {cart.tax.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-base md:text-lg">
                    <span>Total</span>
                    <span>
                      {(
                        cart.totalPrice +
                        cart.shippingPrice +
                        cart.tax
                      ).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 md:p-6 pt-0">
                <div className="w-full space-y-4">
                  <Button className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
