"use client";

import React from "react";
import Link from "next/link";
import { useSingleBooking } from "@/hooks/useBookings";
import { StatusTimeline } from "@/components/customer/StatusTimeline";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  User,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { ITechnician } from "@/types";

interface TrackBookingPageProps {
  params: {
    bookingId: string;
  };
}

export default function TrackBookingPage({ params }: TrackBookingPageProps) {
  const { bookingId } = params;

  // React Query fetching with 5-second auto polling
  const { data: booking, isLoading, error } = useSingleBooking(bookingId, 5000);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CustomerHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
          <p className="text-gray-600 font-medium">বুকিংয়ের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <CustomerHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-800">বুকিং পাওয়া যায়নি</h2>
          <p className="text-gray-600 mt-1 max-w-sm">
            আইডি <strong>{bookingId}</strong> দিয়ে কোনো বুকিং খুঁজে পাওয়া যায়নি। সঠিক আইডি চেক করুন।
          </p>
          <Link href="/" className="mt-6">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              হোম পেজে ফিরে যান
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const assignedTech = booking.assignedTechnician as ITechnician | null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomerHeader />

      <main className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6 my-4">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
              <ArrowLeft className="w-4 h-4" />
              হোমে যান
            </Button>
          </Link>
          <span className="text-xs text-gray-400 font-mono">
            স্বয়ংক্রিয় লাইভ আপডেট সক্রিয় (৫ সে.)
          </span>
        </div>

        {/* Booking Card Header */}
        <Card className="border-brand/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-brand/5 to-transparent pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-brand text-white font-mono text-sm px-3 py-0.5">
                    {booking.bookingId}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(booking.createdAt!).toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mt-2">
                  {booking.serviceCategory} সার্ভিস বুকিং
                </CardTitle>
              </div>

              <div className="self-start sm:self-auto">
                <Badge
                  variant={
                    booking.status === "completed"
                      ? "secondary"
                      : booking.status === "cancelled"
                      ? "destructive"
                      : "default"
                  }
                  className="capitalize text-xs font-semibold px-3 py-1"
                >
                  {booking.status === "pending" && "অপেক্ষমাণ (Pending)"}
                  {booking.status === "assigned" && "কারিগর নিয়োজিত (Assigned)"}
                  {booking.status === "on_the_way" && "কারিগর রওয়ানা দিয়েছে"}
                  {booking.status === "completed" && "সম্পন্ন (Completed)"}
                  {booking.status === "cancelled" && "বাতিল (Cancelled)"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Status Timeline */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">সার্ভিস স্ট্যাটাস ট্র্যাক</h4>
              <StatusTimeline
                currentStatus={booking.status}
                statusHistory={booking.statusHistory}
              />
            </div>

            {/* Assigned Technician Info */}
            {assignedTech ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg border border-emerald-300">
                      {assignedTech.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={assignedTech.profileImage}
                          alt={assignedTech.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-base">
                          {assignedTech.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {assignedTech.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        এলাকা: {assignedTech.area} • সম্পন্ন জব: {assignedTech.totalJobsCompleted} টি
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${assignedTech.phone}`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow">
                      <Phone className="w-4 h-4" />
                      কল করুন ({assignedTech.phone})
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              booking.status !== "cancelled" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-center gap-3 text-amber-800">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
                  <p className="text-sm">
                    আপনার এলাকার নিকটস্থ কারিগর খুঁজে বের করা হচ্ছে। খুব শীঘ্রই কারিগর অ্যাসাইন করা হবে।
                  </p>
                </div>
              )
            )}

            {/* Service & Issue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-sm">
              <div>
                <span className="text-gray-500 font-medium block">সমস্যার বিবরণ:</span>
                <p className="text-gray-800 font-semibold mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {booking.issueDescription}
                </p>
              </div>

              <div>
                <span className="text-gray-500 font-medium block">ঠিকানা:</span>
                <p className="text-gray-800 font-semibold mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span>
                    {booking.location?.address}, {booking.location?.landmark && `(${booking.location.landmark})`}, {booking.location?.area}
                  </span>
                </p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="flex justify-between items-center bg-gray-900 text-white p-4 rounded-xl">
              <span className="font-semibold text-sm">আনুমানিক সার্ভিস ফি:</span>
              <span className="font-bold text-lg text-amber-300">
                ৳{booking.totalCost || 500}
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
