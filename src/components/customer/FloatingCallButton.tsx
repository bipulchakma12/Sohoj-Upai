"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";

export const FloatingCallButton: React.FC = () => {
  const phoneNumber = "01630291849";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/88${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-emerald-600 focus:outline-none"
        title="WhatsApp-এ মেসেজ দিন"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-white font-bold shadow-xl transition-transform hover:scale-105 hover:bg-brand-dark animate-pulse"
        title="জরুরি হেল্পলাইনে কল করুন"
      >
        <Phone className="w-5 h-5" />
        <span className="text-sm font-semibold">জরুরি হেল্পলাইন</span>
      </a>
    </div>
  );
};
