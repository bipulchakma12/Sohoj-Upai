import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";

const sendOtpSchema = z.object({
  phone: z.string().min(10, "Valid phone number is required"),
  name: z.string().optional(),
  address: z.string().optional(),
  action: z.literal("send-otp").optional(),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Valid phone number is required"),
  otp: z.string().min(4, "OTP must be at least 4 digits"),
  action: z.literal("verify-otp").optional(),
});

const authRequestSchema = z.union([sendOtpSchema, verifyOtpSchema]);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { phone, otp, action, name, address } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Step 2: Verify OTP
    if (action === "verify-otp" || otp) {
      const parsed = verifyOtpSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Validation error", details: parsed.error.format() },
          { status: 400 }
        );
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check dummy OTP "1234" or saved DB OTP
      const isOtpValid = otp === "1234" || (user.otp === otp && user.otpExpiry && user.otpExpiry > new Date());

      if (!isOtpValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }

      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpiry = undefined;

      // Update name/address if provided during login/reg
      if (name) user.name = name;
      if (address) user.address = address;

      await user.save();

      const token = generateToken({
        id: user._id.toString(),
        phone: user.phone,
        role: user.role,
      });

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    }

    // Step 1: Send OTP (or register / login initiation)
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        phone,
        name: name || `User-${phone.slice(-4)}`,
        address: address || "",
        role: "user",
      });
    } else {
      if (name) user.name = name;
      if (address) user.address = address;
    }

    // Dummy OTP setup
    const dummyOtp = "1234";
    user.otp = dummyOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await user.save();

    return NextResponse.json({
      success: true,
      message: isNewUser ? "User registered. OTP sent." : "User found. OTP sent.",
      isNewUser,
      otp: dummyOtp, // Static/dummy OTP returned for testing
    });
  } catch (error: any) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
