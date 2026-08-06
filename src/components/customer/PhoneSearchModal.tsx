"use client";

import React from "react";
import Link from "next/link";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IBooking } from "@/types";
import { Clock, UserCheck, Truck, CheckCircle2, ShieldAlert, MapPin, ArrowRight, Phone } from "lucide-react";

interface PhoneSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  bookings: IBooking[];
}

export const PhoneSearchModal: React.FC<PhoneSearchModalProps> = ({
  isOpen,
  onClose,
  phone,
  bookings,
}) => {
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
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
            <ShieldAlert className="w-3 h-3" />
            বাতিলকৃত
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-h-[85vh] overflow-y-auto pr-1 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-brand" />
            ফোন নম্বর: <span className="text-brand font-mono">{phone}</span>
          </DialogTitle>
          <DialogDescription>
            এই ফোন নম্বরে সর্বমোট <strong>{bookings.length} টি</strong> সার্ভিস বুকিং পাওয়া গেছে।
          </DialogDescription>
        </DialogHeader>

        {bookings.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-sm text-slate-500 border border-slate-200">
            এই ফোন নম্বরে কোনো বুকিং পাওয়া যায়নি। সঠিক ফোন নম্বর দিয়ে আবার চেষ্টা করুন।
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.bookingId || (b._id as string)}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-brand/40 shadow-sm transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand bg-brand/10 px-2.5 py-0.5 rounded text-sm">
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

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    {b.location?.area} - {b.location?.address}
                  </span>

                  <Link href={`/track/${b.bookingId}`} onClick={onClose}>
                    <Button
                      size="sm"
                      className="bg-brand hover:bg-brand-dark text-white font-bold h-8 text-xs gap-1"
                    >
                      ট্র্যাকিং দেখুন
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
