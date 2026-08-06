"use client";

import React, { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { IBooking } from "@/types";
import { Toast } from "@/components/ui/toast";
import { Bell, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderFeedProps {
  initialBookings?: IBooking[];
  onAssignClick?: (booking: IBooking) => void;
}

// Function to play a synthesized audio beep sound via Web Audio API
const playAudioAlert = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export const OrderFeed: React.FC<OrderFeedProps> = ({
  initialBookings = [],
  onAssignClick,
}) => {
  const [liveBookings, setLiveBookings] = useState<IBooking[]>(initialBookings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setLiveBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewBooking = (newBooking: IBooking) => {
      console.log("Real-time newBooking received:", newBooking);
      playAudioAlert();

      setToastMessage(`নতুন বুকিং এসেছে! ID: ${newBooking.bookingId} (${newBooking.serviceCategory})`);

      setLiveBookings((prev) => {
        if (prev.some((b) => b._id === newBooking._id || b.bookingId === newBooking.bookingId)) {
          return prev;
        }
        return [newBooking, ...prev];
      });
    };

    socket.on("newBooking", handleNewBooking);

    return () => {
      socket.off("newBooking", handleNewBooking);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <Toast
            title="🔔 নতুন বুকিং আপডেট"
            description={toastMessage}
            variant="success"
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand animate-pulse" />
          <h3 className="font-bold text-gray-900 text-lg">লাইভ বুকিং ফিড (Live Feed)</h3>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ● Socket.io সক্রিয়
        </span>
      </div>

      {/* Live Feed List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {liveBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium">কোনো নতুন বুকিং নেই</p>
          </div>
        ) : (
          liveBookings.map((b) => (
            <div
              key={b._id?.toString() || b.bookingId}
              className="p-4 rounded-xl border border-gray-200 bg-white hover:border-brand/30 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-brand text-white font-mono text-xs">
                    {b.bookingId}
                  </Badge>
                  <span className="font-bold text-gray-900 text-sm">
                    {b.serviceCategory}
                  </span>
                </div>
                <Badge
                  variant={b.status === "pending" ? "destructive" : "default"}
                  className="text-[10px] uppercase font-bold"
                >
                  {b.status}
                </Badge>
              </div>

              <p className="mt-2 text-xs text-gray-700 font-medium line-clamp-2">
                {b.issueDescription}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand" />
                  {b.location?.area || "N/A"}
                </span>

                {b.status === "pending" && onAssignClick && (
                  <button
                    onClick={() => onAssignClick(b)}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    + কারিগর অ্যাসাইন করুন
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
