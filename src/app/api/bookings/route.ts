import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Technician from "@/models/Technician";
import { emitSocketEvent } from "@/lib/socket";

// Flexible Zod Schema for Booking Creation
const createBookingSchema = z.object({
  user: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  serviceCategory: z.string().min(1, "Service category is required"),
  issueDescription: z.string().min(1, "Issue description is required"),
  issueImage: z.string().optional(),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    landmark: z.string().optional(),
    area: z.string().min(1, "Area is required"),
  }),
  totalCost: z.number().optional().default(500),
});

// Helper function to generate incremental bookingId (format SOS-1001)
async function generateNextBookingId(): Promise<string> {
  const lastBooking = await Booking.findOne({}, {}, { sort: { createdAt: -1 } });
  if (!lastBooking || !lastBooking.bookingId) {
    return "SOS-1001";
  }

  const lastId = lastBooking.bookingId;
  const match = lastId.match(/^SOS-(\d+)$/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `SOS-${nextNum}`;
  }

  return `SOS-${Date.now().toString().slice(-4)}`;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Ensure models are registered for populate
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    User; Technician;

    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { user: userIdOrPhone, name, phone, serviceCategory, issueDescription, issueImage, location, totalCost } = parsed.data;

    const targetPhone = phone || (userIdOrPhone && !mongoose.Types.ObjectId.isValid(userIdOrPhone) ? userIdOrPhone : null);
    const targetName = name || (targetPhone ? `User-${targetPhone.slice(-4)}` : "Customer");

    let targetUser = null;

    // 1. Find by ObjectId if valid
    if (userIdOrPhone && mongoose.Types.ObjectId.isValid(userIdOrPhone)) {
      targetUser = await User.findById(userIdOrPhone);
    }

    // 2. Find or create by Phone number
    if (!targetUser && targetPhone) {
      targetUser = await User.findOne({ phone: targetPhone });
      if (!targetUser) {
        targetUser = new User({
          name: targetName,
          phone: targetPhone,
          address: location.address,
          role: "user",
        });
        await targetUser.save();
      } else {
        if (name) targetUser.name = name;
        if (location.address) targetUser.address = location.address;
        await targetUser.save();
      }
    }

    // Fallback if no user info provided
    if (!targetUser) {
      targetUser = new User({
        name: name || "Customer",
        phone: targetPhone || `017${Date.now().toString().slice(-8)}`,
        address: location.address,
        role: "user",
      });
      await targetUser.save();
    }

    const bookingId = await generateNextBookingId();
    const initialStatus = "pending";
    const statusHistory = [
      {
        status: initialStatus,
        changedAt: new Date(),
      },
    ];

    const booking = new Booking({
      bookingId,
      user: targetUser._id,
      serviceCategory,
      issueDescription,
      issueImage: issueImage || "",
      location,
      status: initialStatus,
      totalCost: totalCost || 500,
      statusHistory,
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name phone address role")
      .populate("assignedTechnician", "name phone area rating profileImage");

    // Emit Socket event for real-time admin notification
    emitSocketEvent("newBooking", populatedBooking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: populatedBooking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Booking Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    User; Technician;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const phoneParam = searchParams.get("phone");
    const searchParam = searchParams.get("search");

    const queryConditions: any[] = [];

    if (status) {
      queryConditions.push({ status });
    }

    // Handle Phone or Search Query
    const searchTerm = phoneParam || searchParam;
    if (searchTerm) {
      const cleanTerm = searchTerm.trim();

      // Check if user exists with this phone
      const matchingUsers = await User.find({
        $or: [
          { phone: cleanTerm },
          { phone: { $regex: cleanTerm, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchingUsers.map((u) => u._id);

      queryConditions.push({
        $or: [
          { bookingId: { $regex: cleanTerm, $options: "i" } },
          { user: { $in: userIds } },
        ],
      });
    }

    const finalQuery = queryConditions.length > 0 ? { $and: queryConditions } : {};

    const bookings = await Booking.find(finalQuery)
      .populate("user", "name phone address role")
      .populate("assignedTechnician", "name phone category area rating profileImage")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error("Get Bookings Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
