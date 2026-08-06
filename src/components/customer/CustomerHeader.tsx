"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, MapPin, Phone, MessageCircle, ChevronDown } from "lucide-react";

export function CustomerHeader() {
  const [selectedCity, setSelectedCity] = useState("ঢাকা (Dhaka)");
  const phoneNumber = "01630291849";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top mini announcement bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              ৩০ মিনিট গ্যারান্টি
            </span>
            <span className="text-slate-300">
              জরুরি প্রয়োজনে কারিগর পেতে কল করুন: <strong className="text-amber-300">{phoneNumber}</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] font-semibold text-slate-400">
            <span>২৪/৭ কাস্টমার সাপোর্ট</span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-brand transition-colors block leading-none">
                সহজ উপায়
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Sheba Services
              </span>
            </div>
          </Link>

          {/* Sheba-style Location Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 cursor-pointer border border-slate-200 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Quick Nav Links & Contact Actions */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/88${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-extrabold shadow-md shadow-brand/20 transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            <span>{phoneNumber}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
