import { UserDetails } from "@/feature/userSlice";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { toast } from "sonner";

// Load CashFree SDK in sandbox mode
const initializeSDK = async () => {
  const cashFree = await load({ mode: "sandbox" });
  return cashFree;
};

// Initiate CashFree payment process
const initiatePayment = async (sessionId: string) => {
  const cashFree = await initializeSDK();

  const checkoutOptions = {
    paymentSessionId: sessionId,
    redirectTarget: "_self",
  };
  console.log("Starting checkout with options:", checkoutOptions);
  cashFree.checkout(checkoutOptions);
};

export const cashFreePayment = async (
  amount: number,
  address: any,
  cart: any,
  shippingPrice: number
) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/order/initialize/cashfree",
      {
        amount: amount,
        cart: cart,
        address: address,
        shippingPrice: shippingPrice,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log(data);

    if (!data.success) {
      toast.error("Failed to initiate payment. Please try again.");
      return;
    }

    initiatePayment(data.data.paymentSessionId);
  } catch (error) {
    console.error("Error initializing CashFree payment:", error);
    toast.error("Error initializing CashFree payment");
  }
};
