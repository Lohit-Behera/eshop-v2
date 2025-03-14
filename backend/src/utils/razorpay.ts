import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const razorpayPayment = async (amount: number) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

  const order = await razorpayInstance.orders.create(options);

  return order;
};
