import mongoose, { Schema, Document, Model } from "mongoose";
import { IBooking } from "@/types";

export interface IBookingDocument extends Omit<IBooking, "_id" | "user" | "assignedTechnician">, Document {
  user: mongoose.Types.ObjectId;
  assignedTechnician?: mongoose.Types.ObjectId | null;
}

const LocationSchema = new Schema(
  {
    address: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    area: { type: String, required: true, index: true, trim: true },
  },
  { _id: false }
);

const StatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "assigned", "on_the_way", "completed", "cancelled"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const BookingSchema: Schema<IBookingDocument> = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCategory: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    issueImage: {
      type: String,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "on_the_way", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    assignedTechnician: {
      type: Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    statusHistory: [StatusHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);

export default Booking;
