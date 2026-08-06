"use client";

import React, { useState } from "react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { AssignModal } from "@/components/admin/AssignModal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Search, Loader2, UserCheck, CheckCircle2, Truck, XCircle, MapPin } from "lucide-react";
import { IBooking, BookingStatus } from "@/types";

export default function AdminBookingsPage() {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<IBooking | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const statusParam = selectedStatusTab === "all" ? undefined : selectedStatusTab;
  const { data: bookings, isLoading } = useBookings(statusParam);
  const updateStatusMutation = useUpdateBookingStatus();

  const handleOpenAssign = (booking: IBooking) => {
    setSelectedBookingForAssign(booking);
    setIsAssignModalOpen(true);
  };

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateStatusMutation.mutate({ bookingId, status });
  };

  const filteredBookings = bookings?.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingId.toLowerCase().includes(q) ||
      b.serviceCategory.toLowerCase().includes(q) ||
      b.location?.area.toLowerCase().includes(q) ||
      (b.user as any)?.phone?.includes(q)
    );
  });

  const tabs = [
    { id: "all", label: "সব বুকিং (All)" },
    { id: "pending", label: "অপেক্ষমাণ (Pending)" },
    { id: "assigned", label: "নিয়োজিত (Assigned)" },
    { id: "on_the_way", label: "রওয়ানা (On the Way)" },
    { id: "completed", label: "সম্পন্ন (Completed)" },
    { id: "cancelled", label: "বাতিল (Cancelled)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">জরুরি বুকিং ম্যানেজমেন্ট</h1>
          <p className="text-sm text-gray-500 mt-1">সব কাস্টমার বুকিং ও কারিগর অ্যাসাইনমেন্ট নিয়ন্ত্রণ করুন</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID/ফোন দিয়ে খুঁজুন..."
            className="pl-9 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => {
          const isActive = selectedStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings Table */}
      <Card className="border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
            বুকিং তালিকা লোড হচ্ছে...
          </div>
        ) : !filteredBookings || filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            কোনো বুকিং খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-bold">আইডি ও কাস্টমার</TableHead>
                  <TableHead className="font-bold">ক্যাটাগরি ও বিবরণ</TableHead>
                  <TableHead className="font-bold">ঠিকানা ও এলাকা</TableHead>
                  <TableHead className="font-bold">অ্যাসাইন্ড কারিগর</TableHead>
                  <TableHead className="font-bold">স্ট্যাটাস</TableHead>
                  <TableHead className="font-bold text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((b) => {
                  const tech = b.assignedTechnician as any;
                  return (
                    <TableRow key={b._id?.toString()}>
                      <TableCell>
                        <div>
                          <Badge variant="default" className="bg-brand text-white font-mono text-xs">
                            {b.bookingId}
                          </Badge>
                          <div className="font-bold text-gray-900 text-sm mt-1">
                            {(b.user as any)?.name || "Customer"}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {(b.user as any)?.phone}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-gray-900 text-sm">
                          {b.serviceCategory}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 max-w-xs mt-0.5">
                          {b.issueDescription}
                        </p>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                          <MapPin className="w-3.5 h-3.5 text-brand" />
                          {b.location?.area}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 max-w-xs">
                          {b.location?.address}
                        </p>
                      </TableCell>

                      <TableCell>
                        {tech ? (
                          <div>
                            <div className="font-semibold text-emerald-700 text-xs flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" />
                              {tech.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">{tech.phone}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            অ্যাসাইন করা হয়নি
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            b.status === "pending"
                              ? "destructive"
                              : b.status === "completed"
                              ? "secondary"
                              : "default"
                          }
                          className="text-[10px] capitalize font-bold"
                        >
                          {b.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right space-x-1">
                        {b.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleOpenAssign(b)}
                            className="text-xs bg-brand hover:bg-brand-dark"
                          >
                            অ্যাসাইন
                          </Button>
                        )}

                        {b.status === "assigned" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(b.bookingId, "on_the_way")}
                            className="text-xs border-indigo-200 text-indigo-700 gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            রওয়ানা
                          </Button>
                        )}

                        {b.status === "on_the_way" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(b.bookingId, "completed")}
                            className="text-xs border-emerald-200 text-emerald-700 font-bold gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            সম্পন্ন
                          </Button>
                        )}

                        {b.status !== "completed" && b.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(b.bookingId, "cancelled")}
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            title="বাতিল করুন"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Assign Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        booking={selectedBookingForAssign}
      />
    </div>
  );
}
