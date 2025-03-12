import mongoose, { Schema } from "mongoose";

export interface IAddress {
  user: mongoose.Types.ObjectId;
  name: string;
  type: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model<IAddress>("Address", addressSchema);
