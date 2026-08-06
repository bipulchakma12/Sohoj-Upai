"use client";

import React from "react";
import { Zap, Wrench, Snowflake, Sparkles, Truck, Tv, Star, ArrowRight, ShieldCheck } from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  iconName: "electrical" | "plumbing" | "ac" | "cleaning" | "shifting" | "appliance";
  startingPrice?: string;
  rating?: string;
  reviewsCount?: string;
  onClick: (categoryTitle: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  iconName,
  startingPrice = "৳৪৯৯",
  rating = "4.9",
  reviewsCount = "1.2k+",
  onClick,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case "electrical":
        return <Zap className="w-7 h-7 text-amber-500" />;
      case "plumbing":
        return <Wrench className="w-7 h-7 text-blue-500" />;
      case "ac":
        return <Snowflake className="w-7 h-7 text-cyan-500" />;
      case "cleaning":
        return <Sparkles className="w-7 h-7 text-emerald-500" />;
      case "shifting":
        return <Truck className="w-7 h-7 text-purple-500" />;
      case "appliance":
        return <Tv className="w-7 h-7 text-rose-500" />;
      default:
        return <Wrench className="w-7 h-7 text-brand" />;
    }
  };

  return (
    <div
      onClick={() => onClick(title)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-brand/40 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="rounded-2xl bg-slate-50 p-3 group-hover:bg-brand/10 transition-colors duration-300 border border-slate-100">
            {getIcon()}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {rating} ({reviewsCount})
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {startingPrice} থেকে শুরু
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-brand transition-colors flex items-center gap-1.5">
            {title}
          </h3>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-brand">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          জরুরি বুকিং দিন
        </span>
        <div className="w-7 h-7 rounded-full bg-brand/10 group-hover:bg-brand group-hover:text-white text-brand flex items-center justify-center transition-all">
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
