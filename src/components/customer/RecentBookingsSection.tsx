"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IBooking } from "@/types";
import { Clock, MapPin, ArrowRight, RefreshCw, CheckCircle2, UserCheck, Truck, ShieldAlert } from "lucide-react";

export const RecentBookingsSection: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchRecentBookings = async () => {
    setIsRefreshing(true);
    try {
      const storedIdsRaw = localStorage.getItem("myBookings");
      if (!storedIdsRaw) {
        setBookings([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const bookingIds: string[] = JSON.parse(storedIdsRaw);
      if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        setBookings([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Fetch details for the recent 5 booking IDs
      const fetched: IBooking[] = [];
      for (const id of bookingIds.slice(0, 5)) {
        try {
          const res = await apiClient.get(`/api/bookings/${id}`);
          if (res.data.success && res.data.booking) {
            fetched.push(res.data.booking);
          }
        } catch (e) {
          console.warn(`Could not fetch booking ${id}:`, e);
        }
      }

      setBookings(fetched);
    } catch (err) {
      console.error("Error loading recent bookings:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  if (isLoading) {
    return null;
  }

  if (bookings.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 gap-1">
            <Clock className="w-3 h-3 animate-spin" />
            বুকিং জমা হয়েছে (Pending)
          </Badge>
        );
      case "assigned":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 gap-1">
            <UserCheck className="w-3 h-3" />
            কারিগর নিয়োজিত (Assigned)
          </Badge>
        );
      case "on_the_way":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300 gap-1">
            <Truck className="w-3 h-3 animate-bounce" />
            কারিগর রওয়ানা দিয়েছে
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            সম্পন্ন (Completed)
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 gap-1">
            <ShieldAlert className="w-3 h-3" />
            বাতিলকৃত (Cancelled)
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-8">
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-brand/20 relative overflow-hidden">
        {/* Decorative Circle with pointer-events-none so it never blocks clicks */}
        <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl -mr-10 -mt-10" />

        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 relative z-20">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping" />
              আপনার সাম্প্রতিক জরুরি বুকিং (Active Bookings)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              আপনার ডিভাইস থেকে সম্প্রতি দেওয়া বুকিংসমূহের বর্তমান স্ট্যাটাস
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRecentBookings}
            disabled={isRefreshing}
            className="relative z-50 cursor-pointer select-none border border-slate-300 hover:border-brand bg-white hover:bg-brand/10 text-slate-800 hover:text-brand font-bold text-xs rounded-xl px-4 py-2 inline-flex items-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-brand pointer-events-none ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="pointer-events-none select-none">রিফ্রেশ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {bookings.map((b) => (
            <Card
              key={b.bookingId || (b._id as string)}
              className="border border-gray-200 hover:border-brand/40 transition-all hover:shadow-md bg-slate-50/50"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand text-sm bg-brand/10 px-2.5 py-0.5 rounded-md">
                    {b.bookingId}
                  </span>
                  {getStatusBadge(b.status)}
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {b.serviceCategory} সার্ভিস
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                    {b.issueDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                    {b.location?.area}
                  </span>

                  <Link href={`/track/${b.bookingId}`}>
                    <Button
                      size="sm"
                      className="bg-brand hover:bg-brand-dark text-white font-bold h-8 text-xs gap-1"
                    >
                      লাইভ ট্র্যাকিং দেখুন
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
