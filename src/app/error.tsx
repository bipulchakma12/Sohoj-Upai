"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">কিছু একটা সমস্যা হয়েছে!</h2>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          {error.message || "পেজটি লোড করতে সমস্যা তৈরি হয়েছে। আবার চেষ্টা করুন।"}
        </p>
        <Button
          onClick={() => reset()}
          className="w-full bg-brand hover:bg-brand-dark font-semibold gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          আবার চেষ্টা করুন (Retry)
        </Button>
      </div>
    </div>
  );
}
