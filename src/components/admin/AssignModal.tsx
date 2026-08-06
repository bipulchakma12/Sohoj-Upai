"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useTechnicians } from "@/hooks/useTechnicians";
import { useAssignTechnician } from "@/hooks/useBookings";
import { IBooking } from "@/types";
import { Loader2, UserCheck, AlertCircle, Globe } from "lucide-react";

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: IBooking | null;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [selectedTechId, setSelectedTechId] = useState<string>("");
  const [showAllAreas, setShowAllAreas] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookingArea = booking?.location?.area;
  const currentQueryArea = showAllAreas ? undefined : bookingArea;

  const { data: technicians, isLoading: isTechLoading } = useTechnicians(currentQueryArea);
  const assignMutation = useAssignTechnician();

  const handleAssign = async () => {
    if (!booking || !selectedTechId) {
      setErrorMessage("দয়া করে একজন কারিগর নির্বাচন করুন");
      return;
    }

    setErrorMessage(null);
    try {
      await assignMutation.mutateAsync({
        bookingId: booking.bookingId || (booking._id as string),
        technicianId: selectedTechId,
      });

      setSelectedTechId("");
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || err?.response?.data?.error || "অ্যাসাইন করতে সমস্যা হয়েছে");
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand" />
            কারিগর নিয়ন বা অ্যাসাইন করুন
          </DialogTitle>
          <DialogDescription>
            বুকিং আইডি: <strong className="text-brand font-mono">{booking.bookingId}</strong> ({booking.serviceCategory})
            <br />
            গ্রাহকের এলাকা: <strong className="text-gray-900">{bookingArea}</strong>
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-gray-700">
              {showAllAreas ? "সব এলাকার উপলব্ধ কারিগর তালিকা:" : `${bookingArea} এলাকায় উপলব্ধ কারিগর:`}
            </label>

            <button
              type="button"
              onClick={() => setShowAllAreas(!showAllAreas)}
              className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {showAllAreas ? `${bookingArea} এলাকার কারিগর দেখুন` : "সব এলাকার কারিগর দেখুন"}
            </button>
          </div>

          {isTechLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-4 justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-brand" />
              কারিগর তালিকা লোড হচ্ছে...
            </div>
          ) : !technicians || technicians.length === 0 ? (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-center space-y-2">
              <p>এই এলাকা ({bookingArea}) তে বর্তমানে কোনো কারিগর উপলব্ধ নেই।</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAllAreas(true)}
                className="text-xs border-amber-300 text-amber-900 bg-white"
              >
                সব এলাকার কারিগরদের তালিকা দেখুন
              </Button>
            </div>
          ) : (
            <Select
              value={selectedTechId}
              onChange={(e) => setSelectedTechId(e.target.value)}
            >
              <option value="">-- কারিগর নির্বাচন করুন --</option>
              {technicians.map((tech) => (
                <option key={tech._id?.toString()} value={tech._id?.toString()}>
                  {tech.name} ({tech.phone}) — {tech.category.join(", ")} [{tech.area}] ★{tech.rating}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={assignMutation.isPending}>
            বাতিল
          </Button>
          <Button
            onClick={handleAssign}
            disabled={assignMutation.isPending || !selectedTechId}
            className="bg-brand hover:bg-brand-dark font-bold"
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                অ্যাসাইন হচ্ছে...
              </>
            ) : (
              "অ্যাসাইন করুন"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
