import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";
import { User } from "../models/userModel";
import Joi from "joi";

const addToCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  // joi schema for validation
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
  });

  // Validate request body
  const { value, error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const product = await Product.findById(value.productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  const cart = await Cart.findOne({ user: user?._id });
  if (!cart) {
    const newCart = await Cart.create({
      user: user?._id,
      products: [{ product: product._id, quantity: value.quantity }],
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, null, `${product.name} added to cart successfully`)
      );
  }
  const productIndex = cart.products.findIndex(
    (item: any) => item.product.toString() === product._id.toString()
  );
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += value.quantity;
  } else {
    cart.products.push({ product: product._id, quantity: value.quantity });
  }
  await cart.save();
  return res
    .status(201)
    .json(
      new ApiResponse(201, null, `${product.name} added to cart successfully`)
    );
});

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  const cart = await Cart.aggregate([
    {
      $match: { user: user?._id }, // Filter by user
    },
    {
      $unwind: "$products", // Expand the products array
    },
    {
      $lookup: {
        from: "products", // Reference Product collection
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails", // Extract product object from array
    },
    {
      $set: {
        "products.totalPrice": {
          $multiply: ["$productDetails.sellingPrice", "$products.quantity"],
        }, // sellingPrice * cart quantity
      },
    },
    {
      $group: {
        _id: "$_id", // Group by cart ID
        userId: { $first: "$user" }, // Store user ID
        totalPrice: { $sum: "$products.totalPrice" }, // Sum of product total prices
        products: {
          $push: {
            productId: "$productDetails._id",
            name: "$productDetails.name",
            thumbnail: "$productDetails.thumbnail",
            sellingPrice: "$productDetails.sellingPrice",
            productQuantity: "$productDetails.quantity", // Stock quantity
            cartQuantity: "$products.quantity", // Quantity in the cart
            totalPrice: "$products.totalPrice", // Total price per product
          },
        },
      },
    },
    {
      $set: {
        shippingPrice: { $multiply: ["$totalPrice", 0.02] }, // 2% of total price
        tax: { $multiply: ["$totalPrice", 0.1] }, // 10% of total price
      },
    },
    {
      $project: {
        cartId: "$_id",
        userId: 1,
        totalPrice: 1,
        shippingPrice: 1,
        tax: 1,
        products: 1,
      },
    },
  ]);

  if (!cart) {
    return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, cart[0], "Cart found successfully"));
});

export { addToCart, getCart };
