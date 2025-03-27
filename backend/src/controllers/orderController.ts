import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { razorpayPayment } from "../utils/razorpay";
import { createHmac } from "crypto";
import { User } from "../models/userModel";
import { Order } from "../models/orderModel";
import { Product } from "../models/productModel";
import { Cart } from "../models/cartModel";
import axios from "axios";

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
  const bodyStringify = JSON.stringify(req.body);
  const secret = process.env.RAZORPAY_SECRET_WEBHOOK!;
  const expectedSignature = createHmac("sha256", secret)
    .update(bodyStringify)
    .digest("hex");

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
  const limit = Number(req.query.limit) || 6;

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

const orderInitializeCashFree = asyncHandler(async (req, res) => {
  const { amount, cart, address, shippingPrice } = req.body;

  if (!cart || !cart.products || cart.products.length === 0) {
    return res.status(400).json(new ApiResponse(400, null, "Cart is empty"));
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const order = await Order.create({
    userId: user._id,
    products: cart.products,
    shippingAddress: address,
    totalPrice: cart.totalPrice,
    shippingPrice: shippingPrice,
    grandTotal: cart.totalPrice + shippingPrice,
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "CashFree",
  });

  const orderData = {
    order_id: `order_${Date.now()}`,
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: user._id.toString(),
      customer_name: user.fullName,
      customer_email: user.email,
      customer_phone: user.phoneNumber.toString(),
    },
    order_meta: {
      return_url: `${process.env.CORS_ORIGIN}/order/${order._id}`,
      notify_url: `${process.env.CORS_ORIGIN}/api/v1/order/verify/cashfree`,
    },
  };

  const headers = {
    "Content-Type": "application/json",
    "x-api-version": "2023-08-01",
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
  };

  const { data } = await axios.post(
    `${process.env.CASHFREE_BASE_URL}/orders`,
    orderData,
    { headers }
  );

  if (!data.payment_session_id) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "CashFree order creation failed"));
  }

  order.cashFree = {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
  };
  await order.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { paymentSessionId: data.payment_session_id, orderId: order._id },
        "Order initialized successfully."
      )
    );
});

const verifyCashFreePayment = asyncHandler(async (req, res) => {
  try {
    let reqBody;
    if (!req.body || Object.keys(req.body).length === 0) {
      if (!req.rawBody) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Raw body not found"));
      }
      reqBody = JSON.parse(req.rawBody.toString());
    } else {
      reqBody = req.body;
    }

    const { order_id } = reqBody.data.order;
    const { cf_payment_id, payment_status } = reqBody.data.payment;

    const order = await Order.findOne({ "cashFree.orderId": order_id });
    if (!order) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Order not found"));
    }

    if (order.paymentStatus === "Paid") {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Order already paid"));
    }

    const signature = req.headers["x-webhook-signature"] as string;

    const secretKey = process.env.CASHFREE_SECRET_KEY!;
    if (!req.rawBody) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Raw body not found"));
    }

    const body = req.headers["x-webhook-timestamp"] + req.rawBody.toString();

    // Generate signature for verification
    const generatedSignature = createHmac("sha256", secretKey)
      .update(body)
      .digest("base64");

    if (generatedSignature !== signature) {
      console.error("Signature mismatch:", {
        received: signature,
        generated: generatedSignature,
      });
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Payment verification failed"));
    }

    if (payment_status === "SUCCESS") {
      order.paymentStatus = "Paid";
      order.cashFree = {
        orderId: order_id,
        paymentId: cf_payment_id,
        paymentSessionId: order.cashFree?.paymentSessionId || "",
        signature,
      };
      await order.save();
      const cart = await Cart.findOne({ user: order.userId });
      if (cart) {
        if (cart.products.length > 0) {
          await Promise.all(
            cart.products.map(async (item) => {
              const product = await Product.findById(item.product);
              if (product) {
                product.stock -= item.quantity;
                await product.save();
              }
            })
          );
        }

        cart.products = [];
        await cart.save();
      }
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Payment verified successfully"));
    } else {
      order.paymentStatus = "Failed";
      await order.save();
      return res.status(400).json(new ApiResponse(400, null, "Payment failed"));
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
});

const orderAdminList = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const aggregateQuery = Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        _id: 1,
        grandTotal: 1,
        status: 1,
        paymentStatus: 1,
        paymentMethod: 1,
        fullName: "$user.fullName",
        email: "$user.email",
        phoneNumber: "$user.phoneNumber",
        createdAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const orders = await Order.aggregatePaginate(aggregateQuery, { page, limit });

  if (!orders || orders.docs.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "Orders not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export {
  orderInitializeRazorpay,
  verifyRazorpayPayment,
  getOrder,
  profileOrderList,
  verifyCashFreePayment,
  orderInitializeCashFree,
  orderAdminList,
};
