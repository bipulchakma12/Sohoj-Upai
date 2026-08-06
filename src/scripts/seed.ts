import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes("placeholder")) {
  console.error("❌ Error: Valid MONGODB_URI missing in .env.local");
  process.exit(1);
}

const TechnicianSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true },
    nidNumber: String,
    category: [String],
    area: String,
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    totalJobsCompleted: { type: Number, default: 0 },
    profileImage: String,
  },
  { timestamps: true }
);

const Technician = mongoose.models.Technician || mongoose.model("Technician", TechnicianSchema);

const dummyTechnicians = [
  // Mirpur Technicians
  {
    name: "সোহেল রানা (Mirpur Electrical)",
    phone: "01711990001",
    nidNumber: "1991000000101",
    category: ["Electrical", "AC Repair"],
    area: "Mirpur",
    isAvailable: true,
    rating: 4.9,
    totalJobsCompleted: 45,
  },
  {
    name: "মজনু আলম (Mirpur Plumbing)",
    phone: "01711990002",
    nidNumber: "1991000000102",
    category: ["Plumbing"],
    area: "Mirpur",
    isAvailable: true,
    rating: 4.8,
    totalJobsCompleted: 32,
  },
  {
    name: "তারেক রহমান (Mirpur AC)",
    phone: "01711990003",
    nidNumber: "1991000000103",
    category: ["AC Repair", "Electrical"],
    area: "Mirpur",
    isAvailable: true,
    rating: 5.0,
    totalJobsCompleted: 50,
  },
  // Uttara Technicians
  {
    name: "রহিম হোসেন (Uttara Electrical)",
    phone: "01711112222",
    nidNumber: "1991000000001",
    category: ["Electrical", "AC Repair"],
    area: "Uttara",
    isAvailable: true,
    rating: 4.9,
    totalJobsCompleted: 24,
  },
  {
    name: "কামাল উদ্দিন (Uttara Plumbing)",
    phone: "01711112223",
    nidNumber: "1991000000002",
    category: ["Plumbing"],
    area: "Uttara",
    isAvailable: true,
    rating: 4.8,
    totalJobsCompleted: 18,
  },
  // Mohammadpur Technicians
  {
    name: "মাসুদ পারভেজ (Mohammadpur Tech)",
    phone: "01711990004",
    nidNumber: "1991000000104",
    category: ["Electrical", "Plumbing"],
    area: "Mohammadpur",
    isAvailable: true,
    rating: 4.9,
    totalJobsCompleted: 21,
  },
  // Dhanmondi & Gulshan
  {
    name: "আরিফুর রহমান (Dhanmondi Tech)",
    phone: "01711112227",
    nidNumber: "1991000000007",
    category: ["Electrical"],
    area: "Dhanmondi",
    isAvailable: true,
    rating: 4.8,
    totalJobsCompleted: 15,
  },
  {
    name: "নজরুল ইসলাম (Gulshan Tech)",
    phone: "01711112228",
    nidNumber: "1991000000008",
    category: ["Plumbing", "AC Repair"],
    area: "Gulshan",
    isAvailable: true,
    rating: 5.0,
    totalJobsCompleted: 42,
  },
];

async function runSeed() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB Atlas.");

    for (const tech of dummyTechnicians) {
      await Technician.findOneAndUpdate(
        { phone: tech.phone },
        tech,
        { upsert: true, new: true }
      );
    }

    console.log(`🎉 Successfully seeded ${dummyTechnicians.length} technicians across all areas into Atlas DB!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

runSeed();
