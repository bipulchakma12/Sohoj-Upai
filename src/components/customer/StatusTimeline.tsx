"use client";

import React from "react";
import { CheckCircle2, Clock, Truck, UserCheck, AlertTriangle } from "lucide-react";
import { BookingStatus, IStatusHistoryItem } from "@/types";

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  statusHistory?: IStatusHistoryItem[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  statusHistory = [],
}) => {
  if (currentStatus === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 shrink-0 text-red-600" />
        <div>
          <h4 className="font-bold">বুকিং বাতিল করা হয়েছে</h4>
          <p className="text-sm">এই বুকিংটি বাতিল করা হয়েছে। প্রয়োজনে নতুন বুকিং দিন।</p>
        </div>
      </div>
    );
  }

  const steps: { id: BookingStatus; label: string; icon: React.ReactNode }[] = [
    { id: "pending", label: "বুকিং জমা হয়েছে", icon: <Clock className="w-5 h-5" /> },
    { id: "assigned", label: "কারিগর নির্ধারিত", icon: <UserCheck className="w-5 h-5" /> },
    { id: "on_the_way", label: "কারিগর রওয়ানা দিয়েছে", icon: <Truck className="w-5 h-5" /> },
    { id: "completed", label: "কাজ সম্পন্ন", icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return 0;
      case "assigned":
        return 1;
      case "on_the_way":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  const getLogTime = (stepId: BookingStatus) => {
    const historyItem = statusHistory.find((item) => item.status === stepId);
    if (!historyItem) return null;
    const date = new Date(historyItem.changedAt);
    return date.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="py-4">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const logTime = getLogTime(step.id);

          return (
            <div
              key={step.id}
              className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 w-full sm:w-auto"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-brand border-brand text-white shadow-md shadow-brand/20"
                    : "bg-white border-gray-200 text-gray-400"
                } ${isCurrent ? "ring-4 ring-brand/20 scale-110" : ""}`}
              >
                {step.icon}
              </div>

              <div className="sm:text-center">
                <p
                  className={`text-xs font-semibold ${
                    isDone ? "text-gray-900 font-bold" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {logTime && (
                  <p className="text-[10px] text-gray-500 mt-0.5">{logTime}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
