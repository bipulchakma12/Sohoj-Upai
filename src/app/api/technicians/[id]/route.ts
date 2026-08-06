import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Technician from "@/models/Technician";

const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean().optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = params;

    const technician = await Technician.findById(id);
    if (!technician) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body might be empty, will toggle availability
    }

    const parsed = updateAvailabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    if (parsed.data.isAvailable !== undefined) {
      technician.isAvailable = parsed.data.isAvailable;
    } else {
      technician.isAvailable = !technician.isAvailable;
    }

    await technician.save();

    return NextResponse.json({
      success: true,
      message: `Technician availability updated to ${technician.isAvailable}`,
      technician,
    });
  } catch (error: any) {
    console.error("Toggle Availability Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
