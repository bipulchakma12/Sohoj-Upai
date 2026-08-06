"use client";

import React, { useState } from "react";
import {
  Snowflake,
  Tv,
  Sparkles,
  Zap,
  Wrench,
  Truck,
  Scissors,
  Bug,
  Car,
  Paintbrush,
  Laptop,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
} from "lucide-react";

interface SubService {
  id: string;
  name: string;
  price: string;
  rating: string;
  imageIcon: string;
  description: string;
}

interface ServiceCategoryData {
  id: string;
  title: string;
  icon: React.ReactNode;
  subServices: SubService[];
}

interface ShebaMegaServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const ShebaMegaServices: React.FC<ShebaMegaServicesProps> = ({ onSelectService }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("appliance");

  const categoryData: ServiceCategoryData[] = [
    {
      id: "ac",
      title: "AC Repair Services",
      icon: <Snowflake className="w-5 h-5 text-cyan-500" />,
      subServices: [
        {
          id: "ac-basic",
          name: "AC Master Servicing",
          price: "৳৭৯৯",
          rating: "4.9",
          imageIcon: "❄️",
          description: "ইনডোর ও আউটডোর ওয়াশ, প্রেসার ওয়াটার ক্লিন ও ফিল্টার চেক",
        },
        {
          id: "ac-gas",
          name: "AC Gas Refill & Leak Charge",
          price: "৳১,৪৯৯",
          rating: "5.0",
          imageIcon: "🧪",
          description: "গ্যাস লিকেজ প্রেসার টেস্ট, আর-২২/৩২ ফুল গ্যাস রিফিল",
        },
        {
          id: "ac-install",
          name: "AC Installation & Uninstallation",
          price: "৳১,১৯৯",
          rating: "4.8",
          imageIcon: "⚙️",
          description: "নিরাপদে এসি খুলিয়া অন্য স্থানে ফিটিং ও পাইপিং চেক",
        },
      ],
    },
    {
      id: "appliance",
      title: "Appliance Repair",
      icon: <Tv className="w-5 h-5 text-rose-500" />,
      subServices: [
        {
          id: "fridge",
          name: "Refrigerator Repair",
          price: "৳৫৯৯",
          rating: "4.9",
          imageIcon: "🧊",
          description: "ফ্রিজ ঠান্ডা না হওয়া, গ্যাস রিফিল, কম্প্রেসার ও থার্মোস্ট্যাট রিপেয়ার",
        },
        {
          id: "washing",
          name: "Washing Machine Repair",
          price: "৳৬৯৯",
          rating: "4.8",
          imageIcon: "🧺",
          description: "ড্রাম রোটেশন প্রবলেম, ওয়াটার ড্রেন ফিক্স ও মোটর চেক",
        },
        {
          id: "oven",
          name: "Microwave Oven Repair",
          price: "৳৪৯৯",
          rating: "4.9",
          imageIcon: "🍲",
          description: "হিট না হওয়া, ম্যাগনেট্রন চেঞ্জ, সুইচ ও ফিউজ রিপ্লেসমেন্ট",
        },
        {
          id: "kitchen-hood",
          name: "Kitchen Hood Repair & Clean",
          price: "৳৭৯৯",
          rating: "4.7",
          imageIcon: "🍳",
          description: "তেল-চিটচিটে দাগ পরিষ্কার, মোটর ওয়াশ ও চিমনি সার্ভিস",
        },
        {
          id: "water-purifier",
          name: "Water Purifier Filter Servicing",
          price: "৳৩৯৯",
          rating: "5.0",
          imageIcon: "💧",
          description: "ফিল্টার ক্যান্ডেল পরিবর্তন, আরও মেমব্রেন ক্লিন ও পাম্প ফিক্স",
        },
        {
          id: "geyser",
          name: "Geyser Installation & Repair",
          price: "৳৫৯৯",
          rating: "4.8",
          imageIcon: "🔥",
          description: "পানি গরম না হওয়া, বয়লার লিকেজ সিট ফিক্স ও কানেক্টর চ্যাঞ্জ",
        },
      ],
    },
    {
      id: "cleaning",
      title: "Cleaning Solution",
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      subServices: [
        {
          id: "home-clean",
          name: "Full Home Deep Cleaning",
          price: "৳১,৯৯৯",
          rating: "4.9",
          imageIcon: "🏠",
          description: "রুম, সিলিং, ফ্লোর, ক্যাবিনেট ও ফার্নিচার ভ্যাকুয়াম ক্লিন",
        },
        {
          id: "washroom-clean",
          name: "Bathroom Deep Cleaning",
          price: "৳৪৯৯",
          rating: "4.9",
          imageIcon: "🚿",
          description: "টাইলস আয়রন স্টেইন রিমুভ, ফিটিংস শাইনিং ও ফ্লোর ওয়াশ",
        },
        {
          id: "sofa-clean",
          name: "Sofa & Carpet Shampoo Cleaning",
          price: "৳৮৯৯",
          rating: "4.8",
          imageIcon: "🛋️",
          description: "স্পেশাল শ্যাম্পু ওয়াশ, ডাস্ট মাইট রিমুভ ও ভ্যাকুয়াম ড্রাই",
        },
      ],
    },
    {
      id: "electric-plumbing",
      title: "Electric & Plumbing",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      subServices: [
        {
          id: "electric-wiring",
          name: "Electrical Repair & Wiring",
          price: "৳৪৯৯",
          rating: "4.9",
          imageIcon: "⚡",
          description: "মেইন সুইচ বোর্ড ট্রিপ ফিক্স, শর্ট সার্কিট ও সকেট চেঞ্জ",
        },
        {
          id: "plumbing-leak",
          name: "Plumbing Pipe & Tap Fix",
          price: "৳৩৯৯",
          rating: "4.8",
          imageIcon: "🚰",
          description: "পাইপ লিকেজ মেরামত, সিঙ্ক ব্লক পরিষ্কার ও ট্যাপ চেঞ্জ",
        },
        {
          id: "water-pump",
          name: "Water Pump Motor Servicing",
          price: "৳৭৯৯",
          rating: "4.9",
          imageIcon: "⚙️",
          description: "পানি না ওঠা, ক্যাপাসিটর চেঞ্জ ও পাম্প কয়েল রিপেয়ার",
        },
      ],
    },
    {
      id: "shifting",
      title: "Shifting Solution",
      icon: <Truck className="w-5 h-5 text-purple-500" />,
      subServices: [
        {
          id: "house-shift",
          name: "House Shifting Service",
          price: "৳২,৯৯৯",
          rating: "4.8",
          imageIcon: "📦",
          description: "প্যাকিং, লোডিং, পরিবহন ও আনলোডিং ফুল সার্ভিস",
        },
        {
          id: "office-shift",
          name: "Office Shifting & Relocation",
          price: "৳৪,৯৯৯",
          rating: "4.9",
          imageIcon: "🏢",
          description: "ডেস্ক, ইলেকট্রনিক্স ও আইটি ইকুইপমেন্ট নিরাপদ শিফটিং",
        },
      ],
    },
    {
      id: "beauty",
      title: "Beauty & Salon at Home",
      icon: <Scissors className="w-5 h-5 text-pink-500" />,
      subServices: [
        {
          id: "facial",
          name: "Glow Facial & Skin Care",
          price: "৳৮৯৯",
          rating: "4.9",
          imageIcon: "💅",
          description: "বাসায় বসে পেশাদার বিউটিশিয়ান দ্বারা ফেসিয়াল সেবা",
        },
        {
          id: "hair-cut",
          name: "Hair Cut & Men's Grooming",
          price: "৳৩৯৯",
          rating: "4.8",
          imageIcon: "💇‍♂️",
          description: "বাসায় পুরুষ ও শিশুদের হেয়ার কাট ও শেভিং সার্ভিস",
        },
      ],
    },
    {
      id: "pest-control",
      title: "Pest Control Services",
      icon: <Bug className="w-5 h-5 text-red-500" />,
      subServices: [
        {
          id: "cockroach",
          name: "Cockroach & Ant Control",
          price: "৳৯৯৯",
          rating: "4.9",
          imageIcon: "🪳",
          description: "গেল স্প্রে ও কেমিক্যাল হার্মলেস তেলাপোকা দমন",
        },
        {
          id: "bedbug",
          name: "Bedbug Heat & Chemical Treatment",
          price: "৳১,২৯৯",
          rating: "4.8",
          imageIcon: "🛏️",
          description: "ছাড়পোকা সম্পূর্ণরূপে দূর করার ২ ধাপের স্পেশাল স্প্রে",
        },
      ],
    },
    {
      id: "car-care",
      title: "Car Care & Driver",
      icon: <Car className="w-5 h-5 text-blue-600" />,
      subServices: [
        {
          id: "car-wash",
          name: "Home Car Wash & Polish",
          price: "৳৫৯৯",
          rating: "4.9",
          imageIcon: "🚗",
          description: "ফোম ওয়াশ, ইন্টেরিয়র ভ্যাকুয়াম ও গ্লাস পলিশিং",
        },
        {
          id: "driver",
          name: "Emergency Personal Driver",
          price: "৳৭৯৯",
          rating: "4.8",
          imageIcon: "👨‍✈️",
          description: "অভিজ্ঞ ও লাইসেন্সপ্রাপ্ত জরুরি ড্রাইভার সুবিধা",
        },
      ],
    },
    {
      id: "painting",
      title: "Painting & Renovation",
      icon: <Paintbrush className="w-5 h-5 text-amber-600" />,
      subServices: [
        {
          id: "wall-paint",
          name: "Home Interior Wall Painting",
          price: "৳১,৪৯৯",
          rating: "4.9",
          imageIcon: "🎨",
          description: "প্লাস্টিক পেইন্ট, ডিসটেম্পার ও পুটি ওয়াশ সার্ভিস",
        },
      ],
    },
    {
      id: "electronics",
      title: "Electronics & Gadget Repair",
      icon: <Laptop className="w-5 h-5 text-indigo-500" />,
      subServices: [
        {
          id: "tv-repair",
          name: "LED/LCD TV Repair",
          price: "৳৬৯৯",
          rating: "4.8",
          imageIcon: "📺",
          description: "ডিসপ্লে প্যানেল, সাউন্ড বা পাওয়ার সাপ্লাই বোর্ড ফিক্স",
        },
      ],
    },
  ];

  const activeCategory = categoryData.find((c) => c.id === activeCategoryId) || categoryData[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 my-12">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
        <span className="bg-brand/10 text-brand text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
          সকল ক্যাটাগরি ও সার্ভিসসমূহ (All Services Explorer)
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          আপনার প্রয়োজনীয় সার্ভিসটি বেছে নিন
        </h2>
      </div>

      {/* Main Sheba Explorer Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Left Sidebar Category Menu */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200/80 p-3 space-y-1 overflow-y-auto max-h-[550px]">
          {categoryData.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-white text-brand shadow-md border border-slate-200/80"
                    : "text-slate-700 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? "bg-brand/10" : "bg-white"}`}>
                    {cat.icon}
                  </div>
                  <span>{cat.title}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? "text-brand translate-x-1" : "text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Active Category Sub-Services Grid */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand/10">{activeCategory.icon}</div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-none">
                    {activeCategory.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    অভিজ্ঞ কারিগর দ্বারা সাশ্রয়ী সার্ভিস
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                ১০০% স্যাটিসফ্যাকশন
              </span>
            </div>

            {/* Sub-Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeCategory.subServices.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectService(sub.name)}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand/40 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{sub.imageIcon}</span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {sub.rating}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-brand transition-colors">
                      {sub.name}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700">
                      {sub.price} থেকে শুরু
                    </span>

                    <span className="text-xs font-bold text-brand group-hover:underline flex items-center gap-0.5">
                      বুক করুন
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ৭ দিনের ফ্রি সার্ভিস ওয়ারেন্টি প্রযোজ্য
            </span>
            <span className="font-bold text-slate-700">৩০ মিনিট গ্যারান্টিড রেসপন্স</span>
          </div>
        </div>
      </div>
    </div>
  );
};
