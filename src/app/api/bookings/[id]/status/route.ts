import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Technician from "@/models/Technician";
import User from "@/models/User";
import { BookingStatus } from "@/types";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "assigned", "on_the_way", "completed", "cancelled"]),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    User; Technician;

    const { id } = params;
    const body = await req.json();

    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status } = parsed.data as { status: BookingStatus };

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { bookingId: id }] } : { bookingId: id };

    const booking = await Booking.findOne(query);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    booking.status = status;
    booking.statusHistory.push({
      status,
      changedAt: new Date(),
    });

    await booking.save();

    // If completed, update technician's job count
    if (status === "completed" && booking.assignedTechnician) {
      await Technician.findByIdAndUpdate(booking.assignedTechnician, {
        $inc: { totalJobsCompleted: 1 },
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name phone address role")
      .populate("assignedTechnician", "name phone category area rating totalJobsCompleted profileImage");

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: populatedBooking,
    });
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
