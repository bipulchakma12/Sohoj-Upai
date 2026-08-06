"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "@/lib/axios";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { useCreateBooking } from "@/hooks/useBookings";

const bookingSchema = z.object({
  name: z.string().min(2, "আপনার নাম লিখুন"),
  phone: z.string().min(11, "সঠিক ১১ ডিজিটের ফোন নম্বর দিন"),
  serviceCategory: z.string().min(1, "সার্ভিস ক্যাটাগরি সিলেক্ট করুন"),
  area: z.string().min(1, "আপনার এলাকা সিলেক্ট করুন"),
  address: z.string().min(5, "বিস্তারিত ঠিকানা দিন (বাসা/রোড নম্বর)"),
  landmark: z.string().optional(),
  issueDescription: z.string().min(3, "সমস্যার বিবরণ দিন"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledCategory?: string;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  prefilledCategory = "Electrical",
}) => {
  const router = useRouter();
  const createBookingMutation = useCreateBooking();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceCategory: prefilledCategory,
      area: "Uttara",
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload image to /api/upload if file is selected
      let uploadedImageUrl = "";
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const uploadRes = await apiClient.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploadedImageUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.warn("Image upload failed, proceeding with booking without image:", uploadErr);
        }
      }

      // 2. Create booking
      const bookingPayload = {
        name: data.name,
        phone: data.phone,
        serviceCategory: data.serviceCategory,
        issueDescription: data.issueDescription,
        issueImage: uploadedImageUrl,
        location: {
          address: data.address,
          landmark: data.landmark || "",
          area: data.area,
        },
      };

      const result = await createBookingMutation.mutateAsync(bookingPayload as any);

      // Save bookingId to local myBookings list
      try {
        const bookingId = result.booking.bookingId;
        const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
        const updated = Array.from(new Set([bookingId, ...existing]));
        localStorage.setItem("myBookings", JSON.stringify(updated));
      } catch (saveErr) {
        console.error("Failed to save booking ID to localStorage:", saveErr);
      }

      reset();
      setSelectedFile(null);
      onClose();

      // 3. Redirect to tracking page
      const bookingId = result.booking.bookingId;
      router.push(`/track/${bookingId}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      setSubmitError(
        err?.message || err?.response?.data?.error || "বুকিং করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-h-[90vh] overflow-y-auto pr-1">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-brand">
            জরুরি সার্ভিস বুকিং দিন
          </DialogTitle>
          <DialogDescription>
            আমাদের অভিজ্ঞ কারিগর ৩০ মিনিটের মধ্যে আপনার ঠিকানায় পৌঁছে যাবে।
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              আপনার নাম *
            </label>
            <Input {...register("name")} placeholder="যেমন: রহিম আহমেদ" />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ফোন নম্বর *
            </label>
            <Input
              {...register("phone")}
              placeholder="01700000000"
              type="tel"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                সার্ভিস ক্যাটাগরি *
              </label>
              <Select {...register("serviceCategory")}>
                <option value="Electrical">⚡ ইলেকট্রিক (Electrical)</option>
                <option value="Plumbing">🚰 প্লাম্বিং (Plumbing)</option>
                <option value="AC Repair">❄️ এসি মেকানিক (AC Repair)</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                এলাকা *
              </label>
              <Select {...register("area")}>
                <option value="Uttara">উত্তরা (Uttara)</option>
                <option value="Dhanmondi">ধানমন্ডি (Dhanmondi)</option>
                <option value="Gulshan">গুলশান (Gulshan)</option>
                <option value="Mirpur">মিরপুর (Mirpur)</option>
                <option value="Mohammadpur">মোহাম্মদপুর (Mohammadpur)</option>
                <option value="Banani">বনানী (Banani)</option>
                <option value="Badda">বাড্ডা (Badda)</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              বিস্তারিত ঠিকানা (বাসা/রোড নং) *
            </label>
            <Input
              {...register("address")}
              placeholder="বাসা ১২, রোড ৪, সেক্টর ৩"
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নিকটস্থ ল্যান্ডমার্ক (ঐচ্ছিক)
            </label>
            <Input
              {...register("landmark")}
              placeholder="যেমন: রাজলক্ষ্মী কমপ্লেক্সের কাছে"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              সমস্যার বিবরণ *
            </label>
            <textarea
              {...register("issueDescription")}
              rows={3}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="সমস্যাটির বিস্তারিত লিখুন (যেমন: মেইন সুইচে শর্ট সার্কিট হয়েছে)"
            />
            {errors.issueDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.issueDescription.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              সমস্যার ছবি (ঐচ্ছিক)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-300 p-3 hover:bg-gray-50 text-sm text-gray-600 w-full justify-center">
                <Upload className="w-4 h-4 text-brand" />
                <span>
                  {selectedFile ? selectedFile.name : "ছবি সিলেক্ট করুন"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-brand hover:bg-brand-dark font-bold">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  প্রসেসিং...
                </>
              ) : (
                "বুকিং নিশ্চিত করুন"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
