import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Technician from "@/models/Technician";
import User from "@/models/User";

const assignTechnicianSchema = z.object({
  technicianId: z.string().min(1, "Technician ID is required"),
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

    const parsed = assignTechnicianSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { technicianId } = parsed.data;

    // Check technician existence
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ _id: id }, { bookingId: id }] } : { bookingId: id };

    const booking = await Booking.findOne(query);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    booking.assignedTechnician = new mongoose.Types.ObjectId(technicianId);
    booking.status = "assigned";
    booking.statusHistory.push({
      status: "assigned",
      changedAt: new Date(),
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name phone address role")
      .populate("assignedTechnician", "name phone category area rating totalJobsCompleted profileImage");

    return NextResponse.json({
      success: true,
      message: "Technician assigned successfully",
      booking: populatedBooking,
    });
  } catch (error: any) {
    console.error("Assign Technician Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
