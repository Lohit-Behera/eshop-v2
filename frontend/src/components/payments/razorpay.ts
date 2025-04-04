import { loadRazorpay } from "@/lib/loadRazorpay";
import axios from "axios";
import { toast } from "sonner";
import { UserDetails } from "@/feature/userSlice";
declare global {
  interface Window {
    Razorpay: any;
  }
}
export const razorpayPayment = async (
  amount: number,
  userDetails: UserDetails,
  address: any,
  cart: any,
  shippingPrice: number,
  navigate: (path: string) => void
) => {
  const res = await loadRazorpay(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  if (!res) {
    toast.error("Razorpay SDK failed to load");
    return;
  }

  try {
    const { data } = await axios.post(
      "http://localhost:8000/api/v1/order/initialize/razorpay",
      {
        amount: Math.round(amount),
        currency: "INR",
        cart,
        address,
        shippingPrice,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY,
      amount: data.data.amount,
      currency: data.data.currency,
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: data.data.id,
      handler: async () => {
        navigate(`/order/${data.data.orderId}`);
        toast.success("Payment successful!");
      },
      prefill: {
        name: userDetails?.fullName,
        email: userDetails?.email,
        contact: userDetails?.phone || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", async (response: any) => {
      console.error("Payment Failed:", response);
      toast.error("Payment failed! Please try again.");
    });
    paymentObject.open();
  } catch (error) {
    console.log(error);

    toast.error("Payment initiation failed!");
  }
};
