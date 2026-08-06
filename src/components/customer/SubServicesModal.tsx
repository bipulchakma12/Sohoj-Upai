"use client";

import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, ArrowRight, Wrench, Snowflake, Tv, Sparkles, Scissors, Truck, HeartPulse, Zap } from "lucide-react";

interface SubServiceItem {
  id: string;
  name: string;
  price: string;
  rating: string;
  imageIcon: string;
  description: string;
}

interface SubServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTitle: string;
  onSelectSubService: (subServiceName: string) => void;
}

const subServicesData: Record<string, SubServiceItem[]> = {
  "AC Repair Services": [
    {
      id: "ac-master",
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
  "Appliance Repair": [
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
  "Cleaning Solution": [
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
  "Beauty & Wellness": [
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
  "Shifting": [
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
  "Health & Care": [
    {
      id: "nursing",
      name: "Home Nursing & Patient Care",
      price: "৳৯৯৯",
      rating: "4.9",
      imageIcon: "🩺",
      description: "বাসায় প্রবীণ ও রোগীদের সার্বক্ষণিক সেবিকা ও নার্স সাপোর্ট",
    },
    {
      id: "physio",
      name: "Physiotherapy at Home",
      price: "৳৭৯৯",
      rating: "4.8",
      imageIcon: "🦴",
      description: "অভিজ্ঞ ফিজিওথেরাপিস্ট দ্বারা পেইন রিলিফ ও এক্সারসাইজ সেশন",
    },
  ],
  "Electric & Plumbing": [
    {
      id: "electric-wiring",
      name: "Electrical Repair & Wiring",
      price: "৳৪৯৯",
      rating: "4.9",
      imageIcon: "⚡",
      description: "মেইন সুইচ বোর্ড ট্রিপ ফিক্স, শর্ট সার্কিট ও সকেট চেঞ্জ",
    },
    {
      id: "plumbing-pipe",
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
};

export const SubServicesModal: React.FC<SubServicesModalProps> = ({
  isOpen,
  onClose,
  categoryTitle,
  onSelectSubService,
}) => {
  // Find matching sub-services list, or fallback to default
  const matchedKey = Object.keys(subServicesData).find(
    (k) => k.toLowerCase() === categoryTitle.toLowerCase() || categoryTitle.toLowerCase().includes(k.toLowerCase())
  );

  const items = matchedKey ? subServicesData[matchedKey] : subServicesData["Appliance Repair"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-h-[85vh] overflow-y-auto pr-1 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping" />
            {categoryTitle} - এর সকল সেবাসমূহ
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs">
            আপনার কাঙ্ক্ষিত সার্ভিসটি সিলেক্ট করে বুকিং ফর্মে যান
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {items.map((sub) => (
            <div
              key={sub.id}
              onClick={() => {
                onClose();
                onSelectSubService(sub.name);
              }}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-brand/50 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group space-y-3"
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

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700">
                  {sub.price} থেকে শুরু
                </span>

                <Button
                  size="sm"
                  className="bg-brand hover:bg-brand-dark text-white font-bold h-7 text-xs gap-1 shadow-sm"
                >
                  বুক করুন
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            ৭ দিনের ফ্রি সার্ভিস ওয়ারেন্টি
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
