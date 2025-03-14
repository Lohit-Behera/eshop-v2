import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { razorpayPayment } from "../utils/razorpay";
import { createHmac } from "crypto";
import { User } from "../models/userModel";
import { Order } from "../models/orderModel";
import { Product } from "../models/productModel";
import { Cart } from "../models/cartModel";

const orderInitialize = asyncHandler(async (req, res) => {
  const { amount, cart, address } = req.body;

  if (!cart || !cart.products || cart.products.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "Cart is empty"));
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const data = await razorpayPayment(amount);

  const order = await Order.create({
    userId: user._id,
    products: cart.products,
    shippingAddress: address,
    totalPrice: cart.totalPrice,
    shippingPrice: cart.shippingPrice,
    tax: cart.tax,
    grandTotal: cart.totalPrice + cart.shippingPrice + cart.tax,
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "Razorpay",
  });

  if (!order) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Order creation failed"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...data, orderId: order._id },
        "Order initialized successfully."
      )
    );
});

const orderPlacedRazorpay = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;
  console.log(req.body);

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !orderId
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid payment details"));
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = createHmac(
    "sha256",
    process.env.RAZORPAY_API_SECRET!
  )
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Payment verification failed"));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

  order.paymentStatus = "Paid";
  order.razorpay = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  };
  await order.save();

  const cart = await Cart.findOne({ user: order.userId });
  if (!cart) {
    return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
  }

  await Promise.all(
    cart.products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity -= item.quantity;
        await product.save();
      }
    })
  );

  cart.products = [];
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, order._id, "Order placed successfully"));
});

export { orderInitialize, orderPlacedRazorpay };
