"use client";

import React from "react";
import { Zap, Wrench, Snowflake, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  iconName: "electrical" | "plumbing" | "ac";
  estimatedTime?: string;
  onClick: (categoryTitle: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  iconName,
  estimatedTime = "৩০ মিনিট",
  onClick,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case "electrical":
        return <Zap className="w-8 h-8 text-amber-500" />;
      case "plumbing":
        return <Wrench className="w-8 h-8 text-blue-500" />;
      case "ac":
        return <Snowflake className="w-8 h-8 text-cyan-500" />;
      default:
        return <Wrench className="w-8 h-8 text-brand" />;
    }
  };

  return (
    <div
      onClick={() => onClick(title)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/30"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-gray-50 p-3 group-hover:bg-brand/10 transition-colors duration-300">
          {getIcon()}
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          গ্যারান্টিড {estimatedTime}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4 text-sm font-semibold text-brand">
        <span>জরুরি বুক করুন</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};
