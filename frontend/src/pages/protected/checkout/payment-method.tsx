import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCartIcon as Paypal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Payment } from "./checkout-flow";

interface PaymentMethodProps {
  payment: Payment | null;
  onUpdatePayment: (payment: Payment) => void;
}

export default function PaymentMethod({
  payment,
  onUpdatePayment,
}: PaymentMethodProps) {
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cashfree">(
    payment?.method || "razorpay"
  );

  const handleMethodChange = (value: "razorpay" | "cashfree") => {
    setPaymentMethod(value);
    onUpdatePayment({ method: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: any) => handleMethodChange(value)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 border p-3 md:p-4 rounded-md">
          <RadioGroupItem value="razorpay" id="razorpay" />
          <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <title>Razorpay</title>
                <path
                  d="m22.436 0 -11.91 7.773 -1.174 4.276 6.625 -4.297L11.65 24h4.391l6.395 -24zM14.26 10.098 3.389 17.166 1.564 24h9.008l3.688 -13.902Z"
                  fill="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <span className="text-sm md:text-base">Razorpay</span>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border p-3 md:p-4 rounded-md">
          <RadioGroupItem value="cashfree" id="cashfree" />
          <Label htmlFor="cashfree" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Paypal className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">CashFree</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-4 text-center">
        <p className="mb-4 text-sm md:text-base">
          You will be redirected to {paymentMethod} to complete your payment.
        </p>
      </div>
    </motion.div>
  );
}
