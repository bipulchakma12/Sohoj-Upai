import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <FileQuestion className="w-12 h-12 text-brand mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">পেজটি পাওয়া যায়নি (404)</h2>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই অথবা অন্য কোনো লিংকে স্থানান্তরিত হয়েছে।
        </p>
        <Link href="/">
          <Button className="w-full bg-brand hover:bg-brand-dark font-semibold gap-2">
            <ArrowLeft className="w-4 h-4" />
            হোম পেজে ফিরে যান
          </Button>
        </Link>
      </div>
    </div>
  );
}
