"use client";

import React from "react";
import { TechnicianTable } from "@/components/admin/TechnicianTable";

export default function AdminTechniciansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">টেকনিশিয়ান বা কারিগর ম্যানেজমেন্ট</h1>
        <p className="text-sm text-gray-500 mt-1">সব ভেরিফাইড কারিগরের লিস্ট, এলাকা ফিল্টার ও নতুন অনবোর্ডিং</p>
      </div>

      <TechnicianTable />
    </div>
  );
}
