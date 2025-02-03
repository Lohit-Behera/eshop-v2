import mongoose, { Schema } from "mongoose";

interface iSubCategory {
  name: string;
  isPublic: boolean;
}

export interface ICategory {
  name: string;
  thumbnail: string;
  isPublic: boolean;
  subCategories: iSubCategory[];
}

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  subCategories: [subCategorySchema],
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
