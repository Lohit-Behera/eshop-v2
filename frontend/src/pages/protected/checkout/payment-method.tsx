import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCartIcon as Paypal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [paymentMethod, setPaymentMethod] = useState<
    "razorpay" | "paytm" | "phonepay"
  >(payment?.method || "razorpay");

  const handleMethodChange = (value: "razorpay" | "paytm" | "phonepay") => {
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
              <span className="text-sm md:text-base">Razorpay</span>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border p-3 md:p-4 rounded-md">
          <RadioGroupItem value="paytm" id="paytm" />
          <Label htmlFor="paytm" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base">Paytm</span>
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
        <Button
          type="button"
          onClick={() => {
            onUpdatePayment({ method: paymentMethod });
          }}
        >
          Continue with{" "}
          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
        </Button>
      </div>
    </motion.div>
  );
}
