import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import Technician from "@/models/Technician";

const createTechnicianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  nidNumber: z.string().min(1, "NID number is required"),
  category: z.array(z.enum(["Electrical", "Plumbing", "AC Repair"])).min(1, "At least one category is required"),
  area: z.string().min(1, "Area is required"),
  isAvailable: z.boolean().optional().default(true),
  profileImage: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area");

    const query: Record<string, any> = {
      isAvailable: true,
    };

    if (area) {
      query.area = { $regex: area, $options: "i" };
    }

    const technicians = await Technician.find(query).sort({ rating: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: technicians.length,
      technicians,
    });
  } catch (error: any) {
    console.error("Get Technicians Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = createTechnicianSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, nidNumber, category, area, isAvailable, profileImage } = parsed.data;

    // Check if phone number already exists
    const existingTech = await Technician.findOne({ phone });
    if (existingTech) {
      return NextResponse.json(
        { error: "A technician with this phone number already exists" },
        { status: 400 }
      );
    }

    const technician = new Technician({
      name,
      phone,
      nidNumber,
      category,
      area,
      isAvailable,
      rating: 5.0,
      totalJobsCompleted: 0,
      profileImage,
    });

    await technician.save();

    return NextResponse.json(
      {
        success: true,
        message: "Technician created successfully",
        technician,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Technician Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
