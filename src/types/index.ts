import { Types } from "mongoose";

export type UserRole = "user" | "admin";

export type ServiceCategoryName = "Electrical" | "Plumbing" | "AC Repair" | string;

export type BookingStatus = "pending" | "assigned" | "on_the_way" | "completed" | "cancelled";

export interface IUser {
  _id?: Types.ObjectId | string;
  name: string;
  phone: string;
  address?: string;
  role: UserRole;
  otp?: string;
  otpExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITechnician {
  _id?: Types.ObjectId | string;
  name: string;
  phone: string;
  nidNumber: string;
  category: ServiceCategoryName[];
  area: string;
  isAvailable: boolean;
  rating: number;
  totalJobsCompleted: number;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookingLocation {
  address: string;
  landmark?: string;
  area: string;
}

export interface IStatusHistoryItem {
  status: BookingStatus;
  changedAt: Date;
}

export interface IBooking {
  _id?: Types.ObjectId | string;
  bookingId: string;
  user: Types.ObjectId | IUser | string;
  serviceCategory: ServiceCategoryName;
  issueDescription: string;
  issueImage?: string;
  location: IBookingLocation;
  status: BookingStatus;
  assignedTechnician?: Types.ObjectId | ITechnician | string | null;
  totalCost: number;
  statusHistory: IStatusHistoryItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: Types.ObjectId | string;
  booking: Types.ObjectId | IBooking | string;
  technician: Types.ObjectId | ITechnician | string;
  user: Types.ObjectId | IUser | string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: Types.ObjectId | string;
  name: string;
  icon?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
