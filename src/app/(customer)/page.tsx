"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { CategoryCard } from "@/components/customer/CategoryCard";
import { FloatingCallButton } from "@/components/customer/FloatingCallButton";
import { BookingFormModal } from "@/components/customer/BookingFormModal";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { RecentBookingsSection } from "@/components/customer/RecentBookingsSection";
import { PhoneSearchModal } from "@/components/customer/PhoneSearchModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IBooking } from "@/types";
import { ShieldCheck, Clock, CheckCircle2, Search, Wrench, Loader2 } from "lucide-react";

export default function CustomerLandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Electrical");
  const [searchBookingId, setSearchBookingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IBooking[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchPhoneTerm, setSearchPhoneTerm] = useState("");

  const handleCategoryClick = (categoryTitle: string) => {
    if (categoryTitle.includes("ইলেকট্রিক") || categoryTitle.includes("Electrical")) {
      setSelectedCategory("Electrical");
    } else if (categoryTitle.includes("প্লাম্বিং") || categoryTitle.includes("Plumbing")) {
      setSelectedCategory("Plumbing");
    } else if (categoryTitle.includes("এসি") || categoryTitle.includes("AC Repair")) {
      setSelectedCategory("AC Repair");
    } else {
      setSelectedCategory(categoryTitle);
    }
    setIsModalOpen(true);
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchBookingId.trim();
    if (!term) return;

    // If starts with SOS- or sos-, redirect directly to tracking
    if (term.toLowerCase().startsWith("sos-")) {
      router.push(`/track/${term.toUpperCase()}`);
      return;
    }

    // Otherwise, search by phone number or keyword
    setIsSearching(true);
    try {
      const res = await apiClient.get(`/api/bookings?phone=${encodeURIComponent(term)}`);
      if (res.data.success) {
        const foundBookings: IBooking[] = res.data.bookings || [];
        setSearchResults(foundBookings);
        setSearchPhoneTerm(term);
        setIsSearchModalOpen(true);

        // Auto save found booking IDs to local myBookings list
        if (foundBookings.length > 0) {
          try {
            const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
            const newIds = foundBookings.map((b) => b.bookingId).filter(Boolean);
            const updated = Array.from(new Set([...newIds, ...existing]));
            localStorage.setItem("myBookings", JSON.stringify(updated));
          } catch (saveErr) {
            console.error(saveErr);
          }
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      // Fallback redirect if error
      router.push(`/track/${term}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <CustomerHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand py-16 px-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 mb-6">
            <Clock className="w-4 h-4 text-amber-300 animate-spin-slow" />
            হাইপার-লোকাল জরুরি সার্ভিস সুবিধা
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-md">
            জরুরি সময়ে আপনার এলাকায় <span className="text-amber-300">৩০ মিনিটে</span> বিশ্বস্ত কারিগর
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium">
            ইলেকট্রিক, প্লাম্বিং বা এসি সমস্যার দ্রুততম জরুরি সমাধান। যেকোনো সময়ে ১ ক্লিকে অভিজ্ঞ কারিগর বুকিং করুন।
          </p>

          {/* Flexible Track & Phone Search Input Bar */}
          <div className="mt-8 max-w-lg mx-auto">
            <form onSubmit={handleTrackSearch} className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-lg border border-white/20">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  value={searchBookingId}
                  onChange={(e) => setSearchBookingId(e.target.value)}
                  placeholder="ফোন নম্বর বা বুকিং আইডি (যেমন: 01630291849 বা SOS-1001)"
                  className="pl-9 bg-white text-gray-900 placeholder:text-gray-400 border-none shadow-sm rounded-xl text-xs sm:text-sm"
                />
              </div>
              <Button type="submit" disabled={isSearching} className="bg-amber-400 text-gray-900 hover:bg-amber-300 font-bold rounded-xl px-5">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "খুঁজুন"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 w-full mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            id="cat-electrical"
            title="⚡ ইলেকট্রিক সার্ভিস"
            description="মেইন সুইচ বোর্ডে সমস্যা, শর্ট সার্কিট, ফিউজ মেরামত, আইপিএস লাইন বা ওয়্যারিং ফিক্স।"
            iconName="electrical"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-plumbing"
            title="🚰 প্লাম্বিং সার্ভিস"
            description="পাইপ লিক, পানির ট্যাপ নষ্ট, বেসিন ব্লক, ফ্লাশ মেরামত বা ওয়াটার পাম্প সমস্যা।"
            iconName="plumbing"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-ac"
            title="❄️ এসি মেকানিক"
            description="এসি ঠান্ডা না হওয়া, গ্যাস রিফিল, লিকেজ মেরামত বা জরুরি সার্ভিসিং।"
            iconName="ac"
            onClick={handleCategoryClick}
          />
        </div>
      </section>

      {/* Customer's Recent Active Bookings Section */}
      <RecentBookingsSection />

      {/* Trust Badges */}
      <section className="bg-white py-12 border-y border-gray-100 mb-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">৩০ মিনিটের গ্যারান্টি</h4>
            <p className="text-sm text-gray-500 mt-1">আপনার এলাকায় দ্রুততম সময়ে কারিগর পৌঁছাবে</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">এনআইডি ভেরিফাইড টেকনিশিয়ান</h4>
            <p className="text-sm text-gray-500 mt-1">সম্পূর্ণ নিরাপদ ও যাচাইকৃত দক্ষ কারিগর</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">ন্যায্য ও নির্ধারিত সার্ভিস ফি</h4>
            <p className="text-sm text-gray-500 mt-1">কোনো লুকানো চার্জ ছাড়া সাশ্রয়ী রেট</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-brand" />
            <span className="font-bold text-white text-lg">সহজ উপায়</span>
          </div>
          <p>© 2026 সহজ উপায় (Sohoj Upai). সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>

      {/* Modals & Floating Buttons */}
      <BookingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefilledCategory={selectedCategory}
      />
      <PhoneSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        phone={searchPhoneTerm}
        bookings={searchResults}
      />
      <FloatingCallButton />
    </div>
  );
}
