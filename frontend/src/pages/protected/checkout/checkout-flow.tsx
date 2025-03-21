import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductReview from "./product-review";
import ShippingAddress from "./shipping-address";
import PaymentMethod from "./payment-method";
import OrderSummary from "./order-summary";
import { Address } from "@/feature/addressSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Product } from "@/feature/cartSlice";
import { razorpayPayment } from "@/components/payments/razorpay";
import { useDispatchWithToast } from "@/hooks/dispatch";
import { fetchRazorpayOrderPlaced } from "@/feature/orderSlice";
import { useNavigate } from "react-router-dom";
// Types for our checkout data
export type CheckoutData = {
  products: Product[];
  address: Address | null;
  payment: Payment | null;
  shippingPrice: number;
  totalPrice: number;
};

export type Payment = {
  method: "razorpay" | "paytm" | "phonepay";
};

export default function CheckoutFlow() {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.getCart.data);
  const addresses = useSelector(
    (state: RootState) => state.address.allAddresses.data
  );
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    products: cart.products,
    address: addresses.find((addr) => addr.isDefault) || null,
    shippingPrice: 0,
    payment: { method: "razorpay" } as Payment,
    totalPrice: cart.totalPrice,
  });

  useEffect(() => {
    if (addresses.length > 0 && cart.totalPrice > 0) {
      setLoading(false);
      setCheckoutData((prev) => ({
        ...prev,
        address: addresses.find((addr) => addr.isDefault) || null,
        totalPrice: cart.totalPrice,
      }));
    }
  }, [cart, addresses]);

  const steps = [
    {
      title: "Review Products",
      component: <ProductReview />,
    },
    {
      title: "Shipping",
      component: (
        <ShippingAddress
          totalPrice={checkoutData.totalPrice}
          onUpdateAddress={(address) =>
            setCheckoutData({ ...checkoutData, address })
          }
          onShippingPriceChange={(shippingPrice: number) =>
            setCheckoutData({ ...checkoutData, shippingPrice })
          }
        />
      ),
    },
    {
      title: "Payment",
      component: (
        <PaymentMethod
          payment={checkoutData.payment}
          onUpdatePayment={(payment) =>
            setCheckoutData({ ...checkoutData, payment })
          }
        />
      ),
    },
    {
      title: "Summary",
      component: <OrderSummary checkoutData={checkoutData} />,
    },
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    if (step === 0 && cart.products.length === 0) return true;
    if (step === 1 && !checkoutData.address) return true;
    if (step === 2 && !checkoutData.payment) return true;
    return false;
  };
  const fetchOrderPlaced = useDispatchWithToast(fetchRazorpayOrderPlaced, {
    loadingMessage: "Placing order...",
    getSuccessMessage(data) {
      return data.message || `Order placed successfully`;
    },
    getErrorMessage(error) {
      return (
        error?.message || error || "Something went wrong while placing order"
      );
    },
    onSuccess: (data) => {
      // Redirect to order page
      navigate(`/order/${data.data}`);
    },
  });
  const handlePlaceOrder = () => {
    // Redirect to order confirmation page or dashboard
    if (
      checkoutData.payment &&
      checkoutData.payment.method === "razorpay" &&
      userDetails
    ) {
      razorpayPayment(
        cart.totalPrice + checkoutData.shippingPrice,
        userDetails,
        {
          _id: checkoutData.address?._id,
          name: checkoutData.address?.name,
          type: checkoutData.address?.type,
          addressLine1: checkoutData.address?.addressLine1,
          addressLine2: checkoutData.address?.addressLine2,
          city: checkoutData.address?.city,
          state: checkoutData.address?.state,
          country: checkoutData.address?.country,
          pinCode: checkoutData.address?.pinCode,
          phone: checkoutData.address?.phone,
        },
        cart,
        checkoutData.shippingPrice,
        fetchOrderPlaced,
        navigate
      );
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading</p>
      ) : (
        <div className="container mx-auto py-4 px-2 md:py-10 md:px-4">
          <div className="mb-4 md:mb-8 w-full md:w-[600px] mx-auto">
            <div className="grid grid-cols-4 gap-2 mb-4 md:mb-6 px-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center ${
                        i <= step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`mt-1 text-xs md:text-sm text-center ${
                        i <= step
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile progress bar */}
            <div className="w-full bg-muted h-1 rounded-full">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-4 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                    {steps[step].title}
                  </h2>
                  {steps[step].component}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-6 md:mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button onClick={nextStep} disabled={isNextDisabled()}>
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handlePlaceOrder}>Place Order</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
