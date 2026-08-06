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
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Search,
  Wrench,
  Loader2,
  Star,
  Zap,
  Sparkles,
  Truck,
  Tv,
  MapPin,
  PhoneCall,
  MessageCircle,
  ThumbsUp,
  Award,
  Users,
} from "lucide-react";

export default function CustomerLandingPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Electrical");
  const [searchBookingId, setSearchBookingId] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Uttara");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IBooking[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchPhoneTerm, setSearchPhoneTerm] = useState("");

  const phoneNumber = "01630291849";

  const handleCategoryClick = (categoryTitle: string) => {
    if (categoryTitle.includes("ইলেকট্রিক") || categoryTitle.includes("Electrical")) {
      setSelectedCategory("Electrical");
    } else if (categoryTitle.includes("প্লাম্বিং") || categoryTitle.includes("Plumbing")) {
      setSelectedCategory("Plumbing");
    } else if (categoryTitle.includes("এসি") || categoryTitle.includes("AC Repair")) {
      setSelectedCategory("AC Repair");
    } else if (categoryTitle.includes("ক্লিনিং") || categoryTitle.includes("Cleaning")) {
      setSelectedCategory("Cleaning");
    } else if (categoryTitle.includes("শিফটিং") || categoryTitle.includes("Shifting")) {
      setSelectedCategory("House Shifting");
    } else if (categoryTitle.includes("অ্যাপ্লায়েন্স") || categoryTitle.includes("Appliance")) {
      setSelectedCategory("Appliance Repair");
    } else {
      setSelectedCategory(categoryTitle);
    }
    setIsModalOpen(true);
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchBookingId.trim();
    if (!term) return;

    if (term.toLowerCase().startsWith("sos-")) {
      router.push(`/track/${term.toUpperCase()}`);
      return;
    }

    setIsSearching(true);
    try {
      const res = await apiClient.get(`/api/bookings?phone=${encodeURIComponent(term)}`);
      if (res.data.success) {
        const foundBookings: IBooking[] = res.data.bookings || [];
        setSearchResults(foundBookings);
        setSearchPhoneTerm(term);
        setIsSearchModalOpen(true);

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
      router.push(`/track/${term}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sheba Style Top Header */}
      <CustomerHeader />

      {/* Hero Section Sheba Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 py-16 sm:py-20 px-4 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.25),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/15">
            <Award className="w-4 h-4 text-amber-400" />
            বাংলাদেশের ১ নম্বর নির্ভরযোগ্য হোম সার্ভিস প্ল্যাটফর্ম
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
            জরুরি সময়ে আপনার এলাকায় <span className="text-amber-400">৩০ মিনিটে</span> বিশ্বস্ত কারিগর
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            ইলেকট্রিক, প্লাম্বিং, এসি রিপেয়ার বা হোম ক্লিনিং সমস্যার দ্রুততম জরুরি সমাধান।
          </p>

          {/* Sheba Combined Location + Service Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleTrackSearch}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-2xl border border-white/20"
            >
              {/* Location Select Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto shrink-0 border border-slate-200">
                <MapPin className="w-4 h-4 text-brand" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer text-slate-900 font-bold"
                >
                  <option value="Uttara">উত্তরা (Uttara)</option>
                  <option value="Mirpur">মিরপুর (Mirpur)</option>
                  <option value="Dhanmondi">ধানমন্ডি (Dhanmondi)</option>
                  <option value="Gulshan">গুলশান (Gulshan)</option>
                  <option value="Mohammadpur">মোহাম্মদপুর (Mohammadpur)</option>
                  <option value="Banani">বনানী (Banani)</option>
                  <option value="Badda">বাড্ডা (Badda)</option>
                </select>
              </div>

              {/* Input Field */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchBookingId}
                  onChange={(e) => setSearchBookingId(e.target.value)}
                  placeholder="ফোন নম্বর বা বুকিং আইডি (যেমন: 01630291849 বা SOS-1001)"
                  className="pl-9 bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm h-10 shadow-none focus-visible:ring-0"
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 h-10 shadow-md shadow-brand/30"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "খুঁজুন (Search)"}
              </Button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              ৫০,০০০+ সফল সার্ভিস
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              ৪.৯/৫ এভারেজ কাস্টমার রেটিং
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              এনআইডি ভেরিফাইড কারিগর
            </span>
          </div>
        </div>
      </section>

      {/* Services Grid Sheba Style */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 w-full mb-12">
        <div className="text-center mb-6">
          <span className="bg-brand/10 text-brand text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            আমাদের সেবাসমূহ (Our Services)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            id="cat-electrical"
            title="⚡ ইলেকট্রিক সার্ভিস"
            description="মেইন সুইচ বোর্ডে সমস্যা, শর্ট সার্কিট, ফিউজ মেরামত, আইপিএস লাইন বা ওয়ারিং সমাধান।"
            iconName="electrical"
            startingPrice="৳৪৯৯"
            rating="4.9"
            reviewsCount="1.8k"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-plumbing"
            title="🚰 প্লাম্বিং সমাধান"
            description="পাইপ লিক, পানির ট্যাপ মেরামত, বেসিন ব্লক, ফ্লাশ ফিক্স বা ওয়াটার পাম্প সার্ভিসিং।"
            iconName="plumbing"
            startingPrice="৳৩৯৯"
            rating="4.8"
            reviewsCount="1.4k"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-ac"
            title="❄️ এসি মেকানিক"
            description="এসি ঠান্ডা না হওয়া, গ্যাস রিফিল, মাসটার সার্ভিসিং বা লিকেজ রিপেয়ার।"
            iconName="ac"
            startingPrice="৳৭৯৯"
            rating="5.0"
            reviewsCount="2.1k"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-cleaning"
            title="🧹 হোম ক্লিনিং"
            description="বাসা-বাড়ি ডিপ ক্লিনিং, ওয়াশরুম ক্লিনিং, সোফা ও কার্পেট ওয়াশ সার্ভিস।"
            iconName="cleaning"
            startingPrice="৳৯৯৯"
            rating="4.9"
            reviewsCount="950+"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-shifting"
            title="📦 বাসা বদল / শিফটিং"
            description="নিরাপদে বাসা ও অফিস শিফটিং, মালামাল প্যাকিং ও অভিজ্ঞ লেবার সাপোর্ট।"
            iconName="shifting"
            startingPrice="৳২,৪৯৯"
            rating="4.8"
            reviewsCount="720+"
            onClick={handleCategoryClick}
          />

          <CategoryCard
            id="cat-appliance"
            title="🛠️ অ্যাপ্লায়েন্স মেরামত"
            description="রেফ্রিজারেটর, ওভেন, ওয়াশিং মেশিন বা টিভি হোম সার্ভিসিং ও পার্টস রিপ্লেসমেন্ট।"
            iconName="appliance"
            startingPrice="৳৫৯৯"
            rating="4.9"
            reviewsCount="1.1k"
            onClick={handleCategoryClick}
          />
        </div>
      </section>

      {/* Customer's Recent Active Bookings Section */}
      <RecentBookingsSection />

      {/* "How Sohoj Upai Works" Sheba Style */}
      <section className="bg-white py-16 border-y border-slate-200/80 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-brand font-extrabold text-xs uppercase tracking-wider bg-brand/10 px-3 py-1 rounded-full">
              সহজ কার্যপদ্ধতি
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ৩টি সহজ ধাপে সেবা নিন
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              কোনো জামেলা ছাড়াই মাত্র ১ মিনিটে আপনার কাঙ্ক্ষিত সার্ভিস বুক দিন
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center relative group hover:border-brand/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-brand text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
                ১
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                সার্ভিস নির্বাচন করুন
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার এলাকার জন্য প্রয়োজনীয় ক্যাটাগরি বেছে নিয়ে ফর্মে আপনার ঠিকানা ও সমস্যা লিখুন।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center relative group hover:border-brand/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-brand text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
                ২
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                কারিগর অ্যাসাইনমেন্ট
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আমাদের সিস্টেম ৩০ মিনিটের মধ্যে আপনার নিকটস্থ অভিজ্ঞ ও ভেরিফাইড টেকনিশিয়ান নিয়োজিত করবে।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center relative group hover:border-brand/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-brand text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
                ৩
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                কাজ সম্পন্ন ও পেমেন্ট
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                কারিগর বাড়িতে এসে কাজ শেষ করার পর নির্ধারিত ফি পরিশোধ করুন ও ৭ দিনের ওয়ারেন্টি উপভোগ করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Sheba Style */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-brand font-extrabold text-xs uppercase tracking-wider bg-brand/10 px-3 py-1 rounded-full">
            গ্রাহক প্রতিক্রিয়া
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            গ্রাহকেরা আমাদের সম্পর্কে যা বলছেন
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "জরুরি রাতে মেইন সুইচে শর্ট সার্কিট হয়েছিল। বুকিং দেওয়ার ঠিক ২৫ মিনিটের মাথায় কারিগর এসে সমস্যা ফিক্স করে দিয়েছে। অসাধারণ সার্ভিস!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">কামরুল হাসান</h4>
                <p className="text-[10px] text-slate-400">উত্তরা, ঢাকা</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "আমাদের এসি ঠান্ডা হচ্ছিল না। টেকনিশিয়ান এসে গ্যাস রিফিল ও ক্লিন করে দিল। সার্ভিস চার্জ একদম ন্যায্য ও স্বচ্ছ ছিল।"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">তানজিলা সুলতানা</h4>
                <p className="text-[10px] text-slate-400">ধানমন্ডি, ঢাকা</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "প্লাম্বিংয়ের পানির ট্যাপ ও লিকিংয়ের কাজ খুব নিখুঁতভাবে শেষ করেছেন জসিম ভাই। ফোন নম্বর দিয়ে ট্র্যাক করার অপশনটি দারুণ!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">সাবিহা চৌধুরী</h4>
                <p className="text-[10px] text-slate-400">মিরপুর, ঢাকা</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sheba Style Comprehensive Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="font-black text-white text-base">সহজ উপায়</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                বাংলাদেশের জরুরি হোম সার্ভিস প্ল্যাটফর্ম। ইলেকট্রিক, প্লাম্বিং, এসি রিপেয়ার ও ক্লিনিং সার্ভিসের নির্ভরযোগ্য সমাধান।
              </p>
            </div>

            {/* Covered Areas */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">কভারকৃত এলাকাসমূহ</h4>
              <ul className="space-y-1 text-slate-400">
                <li>উত্তরা (Uttara)</li>
                <li>মিরপুর (Mirpur)</li>
                <li>ধানমন্ডি (Dhanmondi)</li>
                <li>গুলশান ও বনানী (Gulshan & Banani)</li>
                <li>মোহাম্মদপুর (Mohammadpur)</li>
                <li>বাড্ডা ও বসুন্ধরা (Badda & Bashundhara)</li>
              </ul>
            </div>

            {/* Popular Services */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">জনপ্রিয় সার্ভিসসমূহ</h4>
              <ul className="space-y-1 text-slate-400">
                <li>⚡ ইলেকট্রিক ফিউজ ও ওয়্যারিং</li>
                <li>🚰 প্লাম্বিং ও পাইপ লিকিং</li>
                <li>❄️ এসি সার্ভিসিং ও গ্যাস রিফিল</li>
                <li>🧹 হোম ও ওয়াশরুম ডিপ ক্লিনিং</li>
                <li>📦 বাসা ও অফিস শিফটিং</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">যোগাযোগ ও হেল্পলাইন</h4>
              <p className="flex items-center gap-2 text-white font-bold">
                <PhoneCall className="w-4 h-4 text-brand" />
                <span>{phoneNumber}</span>
              </p>
              <a
                href={`https://wa.me/88${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:underline font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp মেচেজ দিন</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p>© 2026 সহজ উপায় (Sohoj Upai). সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>গোপনীয়তা নীতি</span>
              <span>ব্যবহারের শর্তাবলী</span>
            </div>
          </div>
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
