import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "@/types";

export interface ICategoryDocument extends Omit<ICategory, "_id">, Document {}

const CategorySchema: Schema<ICategoryDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default Category;
