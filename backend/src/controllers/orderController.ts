import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { razorpayPayment } from "../utils/razorpay";
import { createHmac } from "crypto";
import { User } from "../models/userModel";
import { Order } from "../models/orderModel";
import { Product } from "../models/productModel";
import { Cart } from "../models/cartModel";

const orderInitializeRazorpay = asyncHandler(async (req, res) => {
  const { amount, cart, address, shippingPrice } = req.body;

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
    shippingPrice: shippingPrice,
    grandTotal: cart.totalPrice + shippingPrice,
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "Razorpay",
    razorpay: {
      orderId: data.id,
    },
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

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const body = req.body;
  const orderId = body.payload.payment.entity.order_id;
  const paymentId = body.payload.payment.entity.id;
  const order = await Order.findOne({ razorpay: { orderId } });
  if (!order) {
    return res.status(400).json(new ApiResponse(400, null, "Order not found"));
  }
  // get the signature from header
  const signature = req.headers["x-razorpay-signature"] as string;
  console.log(signature);
  const bodyStringify = JSON.stringify(req.body);
  const secret = `t6XwvaeMRf5z8kn`;
  const expectedSignature = createHmac("sha256", secret)
    .update(bodyStringify)
    .digest("hex");
  console.log("expectedSignature", expectedSignature);

  if (expectedSignature !== signature) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Payment verification failed"));
  }

  order.paymentStatus = "Paid";
  order.razorpay = {
    orderId: body.payload.payment.entity.order_id,
    paymentId: body.payload.payment.entity.id,
    signature: body.payload.payment.entity.signature,
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
        product.stock -= item.quantity;
        await product.save();
      }
    })
  );

  cart.products = [];
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Payment verified successfully."));
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }
  return res.status(200).json(new ApiResponse(200, order, "Order found"));
});

const profileOrderList = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // Aggregation pipeline
  const aggregateQuery = Order.aggregate([
    { $match: { userId: req.user?._id } },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        userId: 0,
        shippingAddress: 0,
        razorpay: 0,
        __v: 0,
      },
    },
  ]);

  // Apply pagination
  const orders = await Order.aggregatePaginate(aggregateQuery, { page, limit });

  if (!orders || orders.docs.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No orders found"));
  }
  return res.status(200).json(new ApiResponse(200, orders, "Orders found"));
});

export {
  orderInitializeRazorpay,
  verifyRazorpayPayment,
  getOrder,
  profileOrderList,
};
