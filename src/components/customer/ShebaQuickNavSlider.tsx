"use client";

import React, { useRef } from "react";
import {
  LayoutGrid,
  Snowflake,
  Tv,
  Sparkles,
  Scissors,
  Truck,
  HeartPulse,
  Zap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface ShebaQuickNavSliderProps {
  onSelectCategory: (categoryName: string) => void;
}

export const ShebaQuickNavSlider: React.FC<ShebaQuickNavSliderProps> = ({ onSelectCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickNavItems = [
    {
      id: "all-services",
      title: "All Services",
      icon: <LayoutGrid className="w-7 h-7 text-brand" />,
      isHighlight: true,
    },
    {
      id: "ac",
      title: "AC Repair Services",
      icon: <Snowflake className="w-7 h-7 text-cyan-500" />,
    },
    {
      id: "appliance",
      title: "Appliance Repair",
      icon: <Tv className="w-7 h-7 text-rose-500" />,
    },
    {
      id: "cleaning",
      title: "Cleaning Solution",
      icon: <Sparkles className="w-7 h-7 text-emerald-500" />,
    },
    {
      id: "beauty",
      title: "Beauty & Wellness",
      icon: <Scissors className="w-7 h-7 text-pink-500" />,
    },
    {
      id: "shifting",
      title: "Shifting",
      icon: <Truck className="w-7 h-7 text-purple-500" />,
    },
    {
      id: "health",
      title: "Health & Care",
      icon: <HeartPulse className="w-7 h-7 text-red-500" />,
    },
    {
      id: "electric",
      title: "Electric & Plumbing",
      icon: <Zap className="w-7 h-7 text-amber-500" />,
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-12 relative z-30">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 relative group">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-brand transition-all cursor-pointer hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-2"
        >
          {quickNavItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.title)}
              className={`flex flex-col items-center justify-center gap-3 p-3 rounded-2xl min-w-[120px] sm:min-w-[140px] border transition-all cursor-pointer group/item shrink-0 ${
                item.isHighlight
                  ? "bg-brand/5 border-brand/30 hover:bg-brand/10 hover:border-brand"
                  : "hover:bg-slate-50 border-transparent hover:border-slate-200/80"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover/item:scale-110 transition-all ${
                  item.isHighlight
                    ? "bg-brand text-white border-brand shadow-md shadow-brand/20"
                    : "bg-slate-50 border-slate-100 group-hover/item:bg-white group-hover/item:shadow-md"
                }`}
              >
                {item.isHighlight ? <LayoutGrid className="w-6 h-6 text-white" /> : item.icon}
              </div>
              <span
                className={`text-xs font-black text-center leading-snug transition-colors ${
                  item.isHighlight ? "text-brand" : "text-slate-800 group-hover/item:text-brand"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
