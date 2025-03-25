import mongoose, { Schema } from "mongoose";

interface IBanner {
  _id: string;
  image: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
