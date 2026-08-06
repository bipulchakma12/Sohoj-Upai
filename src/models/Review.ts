import mongoose, { Schema, Document, Model } from "mongoose";
import { IReview } from "@/types";

export interface IReviewDocument extends Omit<IReview, "_id" | "booking" | "technician" | "user">, Document {
  booking: mongoose.Types.ObjectId;
  technician: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const ReviewSchema: Schema<IReviewDocument> = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    technician: {
      type: Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review: Model<IReviewDocument> =
  mongoose.models.Review || mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
