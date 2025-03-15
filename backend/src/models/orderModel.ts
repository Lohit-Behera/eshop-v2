import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface IProduct {
  productId: string;
  name: string;
  thumbnail: string;
  sellingPrice: number;
  productQuantity: number;
  cartQuantity: number;
  totalPrice: number;
}

interface IAddress {
  _id: string;
  name: string;
  type: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IProduct[];
  shippingAddress: IAddress;
  totalPrice: number;
  shippingPrice: number;
  tax: number;
  grandTotal: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod:
    | "Razorpay"
    | "Debit Card"
    | "PayPal"
    | "UPI"
    | "Cash on Delivery";
  razorpay?: {
    orderId: string;
    paymentId: string;
    signature: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        thumbnail: { type: String, required: true },
        sellingPrice: { type: Number, required: true },
        stock: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pinCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Debit Card", "PayPal", "UPI", "Cash on Delivery"],
      required: true,
    },
    razorpay: {
      orderId: { type: String },
      paymentId: { type: String },
      signature: { type: String },
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongooseAggregatePaginate);

export const Order = mongoose.model<
  IOrder,
  mongoose.AggregatePaginateModel<IOrder>
>("Order", OrderSchema);
