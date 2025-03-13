import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  MapPin,
  ShoppingCartIcon as Paypal,
} from "lucide-react";

import type { CheckoutData } from "./checkout-flow";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface OrderSummaryProps {
  checkoutData: CheckoutData;
}

export default function OrderSummary({ checkoutData }: OrderSummaryProps) {
  const { products, address, payment } = checkoutData;

  const cart = useSelector((state: RootState) => state.cart.getCart.data);
  const getPaymentIcon = () => {
    if (!payment) return null;

    switch (payment.method) {
      case "razorpay":
        return <CreditCard className="h-5 w-5" />;
      case "paypal":
        return <Paypal className="h-5 w-5" />;
      case "paytm":
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.9 5.4C7.4 4.8 7.8 4 7.7 3.2C7 3.2 6.2 3.7 5.7 4.3C5.2 4.9 4.9 5.7 5 6.5C5.7 6.5 6.4 6 6.9 5.4ZM7.9 6.8C6.8 6.7 5.9 7.4 5.4 7.4C4.9 7.4 4.1 6.9 3.3 6.9C2.2 6.9 1.2 7.6 0.6 8.7C-0.6 10.9 0.3 14.1 1.4 15.9C2 16.8 2.7 17.8 3.6 17.8C4.5 17.7 4.8 17.2 5.9 17.2C6.9 17.2 7.2 17.8 8.2 17.7C9.2 17.7 9.8 16.8 10.4 15.9C11 14.9 11.3 13.9 11.3 13.8C11.3 13.8 9.5 13.1 9.5 11.1C9.5 9.4 10.9 8.6 11 8.5C10.1 7.2 8.8 7 8.2 7C7.6 7 7 6.9 7.9 6.8Z"
              fill="currentColor"
            />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="font-medium">Order Items</h3>
        {products.map((product) => (
          <div
            key={product.productId}
            className="flex flex-col sm:flex-row items-start gap-3 border-b pb-4"
          >
            <div className="flex-shrink-0">
              <img
                src={product.thumbnail || "/placeholder.svg"}
                alt={product.name}
                className="rounded-md object-cover w-16 h-16"
              />
            </div>
            <div className="flex-grow min-w-0 mt-2 sm:mt-0">
              <h4 className="font-medium text-sm md:text-base line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Qty: {product.cartQuantity}
              </p>
            </div>
            <div className="text-right text-sm md:text-base mt-2 sm:mt-0 w-full sm:w-auto">
              ₹{product.totalPrice.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Shipping Address</h3>
        {address && (
          <div className="flex items-start gap-2 sm:gap-3 border p-3 sm:p-4 rounded-md">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm md:text-base">{address.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {address.addressLine1}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {address.city}, {address.state} {address.pinCode}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {address.country}
              </p>
              {address.phone && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Phone: {address.phone}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Payment Method</h3>
        {payment && (
          <div className="flex items-center gap-3 border p-3 sm:p-4 rounded-md">
            {getPaymentIcon()}
            <div>
              {payment.method === "razorpay" ? (
                <p className="font-medium text-sm md:text-base">Razorpay</p>
              ) : payment.method === "paypal" ? (
                <p className="font-medium text-sm md:text-base">PayPal</p>
              ) : (
                <p className="font-medium text-sm md:text-base">Apple Pay</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{cart.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-muted-foreground">Shipping</span>
          <span>₹{cart.shippingPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-muted-foreground">Tax</span>
          <span>₹{cart.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-medium text-base md:text-lg mt-2 pt-2 border-t">
          <span>Total</span>
          <span>
            ₹
            {(cart.totalPrice + cart.tax + cart.shippingPrice).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-muted/30 p-3 sm:p-4 rounded-md mt-6">
        <div className="flex items-center gap-2 text-primary">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium text-sm md:text-base">
            Ready to place your order
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          By placing your order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </motion.div>
  );
}
