import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Technician from "@/models/Technician";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    User; Technician;

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Check if id is valid ObjectId or custom string (SOS-1001 format)
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { bookingId: id }] } : { bookingId: id };

    const booking = await Booking.findOne(query)
      .populate("user", "name phone address role")
      .populate("assignedTechnician", "name phone category area rating totalJobsCompleted profileImage");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("Get Booking By ID Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
