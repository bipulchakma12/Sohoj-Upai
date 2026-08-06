import mongoose, { Schema, Document, Model } from "mongoose";
import { ITechnician } from "@/types";

export interface ITechnicianDocument extends Omit<ITechnician, "_id">, Document {}

const TechnicianSchema: Schema<ITechnicianDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Technician name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    nidNumber: {
      type: String,
      required: [true, "NID number is required"],
      trim: true,
    },
    category: [
      {
        type: String,
        enum: ["Electrical", "Plumbing", "AC Repair"],
        required: true,
      },
    ],
    area: {
      type: String,
      required: [true, "Operating area is required"],
      index: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Technician: Model<ITechnicianDocument> =
  mongoose.models.Technician || mongoose.model<ITechnicianDocument>("Technician", TechnicianSchema);

export default Technician;
