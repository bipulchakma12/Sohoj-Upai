"use client";

import React, { useState } from "react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useTechnicians } from "@/hooks/useTechnicians";
import { OrderFeed } from "@/components/admin/OrderFeed";
import { AssignModal } from "@/components/admin/AssignModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  UserCheck,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { IBooking, BookingStatus } from "@/types";

export default function AdminDashboardPage() {
  const { data: bookings, isLoading: isBookingsLoading } = useBookings();
  const { data: technicians } = useTechnicians();
  const updateStatusMutation = useUpdateBookingStatus();

  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<IBooking | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const totalBookings = bookings?.length || 0;
  const pendingCount = bookings?.filter((b) => b.status === "pending").length || 0;
  const assignedCount = bookings?.filter((b) => b.status === "assigned" || b.status === "on_the_way").length || 0;
  const completedCount = bookings?.filter((b) => b.status === "completed").length || 0;
  const activeTechCount = technicians?.filter((t) => t.isAvailable).length || 0;

  const handleOpenAssign = (booking: IBooking) => {
    setSelectedBookingForAssign(booking);
    setIsAssignModalOpen(true);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateStatusMutation.mutate({ bookingId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">মোট বুকিং (Total)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalBookings}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">অপেক্ষমাণ (Pending)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">চলমান (Assigned)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{assignedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">সম্পন্ন (Completed)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Order Feed & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Socket Order Feed */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <OrderFeed
            initialBookings={bookings?.filter((b) => b.status === "pending") || []}
            onAssignClick={handleOpenAssign}
          />
        </div>

        {/* Right Column: Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">সাম্প্রতিক বুকিং সমূহের তালিকা</h3>
            <span className="text-xs text-gray-500">অনলাইন টেকনিশিয়ান: <strong>{activeTechCount}</strong> জন</span>
          </div>

          {isBookingsLoading ? (
            <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand" />
              বুকিং তালিকা লোড হচ্ছে...
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              এখনো কোনো বুকিং নেই।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-bold">আইডি ও কাস্টমার</TableHead>
                    <TableHead className="font-bold">ক্যাটাগরি</TableHead>
                    <TableHead className="font-bold">এলাকা</TableHead>
                    <TableHead className="font-bold">স্ট্যাটাস</TableHead>
                    <TableHead className="font-bold text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.slice(0, 8).map((b) => {
                    const tech = b.assignedTechnician as any;
                    return (
                      <TableRow key={b._id?.toString()}>
                        <TableCell>
                          <div>
                            <span className="font-mono font-bold text-brand text-xs">
                              {b.bookingId}
                            </span>
                            <div className="text-xs font-semibold text-gray-800">
                              {(b.user as any)?.name || "Customer"}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {(b.user as any)?.phone}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-medium text-xs">
                          {b.serviceCategory}
                        </TableCell>

                        <TableCell className="text-xs font-medium text-gray-700">
                          {b.location?.area}
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
                              className="text-xs border-indigo-200 text-indigo-700"
                            >
                              রওয়ানা
                            </Button>
                          )}

                          {b.status === "on_the_way" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(b.bookingId, "completed")}
                              className="text-xs border-emerald-200 text-emerald-700 font-bold"
                            >
                              সম্পন্ন
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
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        booking={selectedBookingForAssign}
      />
    </div>
  );
}
