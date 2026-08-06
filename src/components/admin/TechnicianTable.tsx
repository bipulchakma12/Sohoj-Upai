"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTechnicians, useCreateTechnician, useToggleTechnicianAvailability } from "@/hooks/useTechnicians";
import { UserPlus, Search, Star, Loader2, CheckCircle2, XCircle } from "lucide-react";

export const TechnicianTable: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new technician
  const [newTechName, setNewTechName] = useState("");
  const [newTechPhone, setNewTechPhone] = useState("");
  const [newTechNid, setNewTechNid] = useState("");
  const [newTechArea, setNewTechArea] = useState("Uttara");
  const [newTechCategories, setNewTechCategories] = useState<string[]>(["Electrical"]);

  const { data: technicians, isLoading } = useTechnicians(selectedArea || undefined);
  const createTechMutation = useCreateTechnician();
  const toggleMutation = useToggleTechnicianAvailability();

  const filteredTechnicians = technicians?.filter((tech) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tech.name.toLowerCase().includes(q) ||
      tech.phone.includes(q) ||
      tech.area.toLowerCase().includes(q)
    );
  });

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName || !newTechPhone || !newTechNid) return;

    try {
      await createTechMutation.mutateAsync({
        name: newTechName,
        phone: newTechPhone,
        nidNumber: newTechNid,
        area: newTechArea,
        category: newTechCategories,
        isAvailable: true,
      });

      setNewTechName("");
      setNewTechPhone("");
      setNewTechNid("");
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Add tech error:", err);
    }
  };

  const handleCategoryCheckbox = (cat: string) => {
    if (newTechCategories.includes(cat)) {
      if (newTechCategories.length > 1) {
        setNewTechCategories(newTechCategories.filter((c) => c !== cat));
      }
    } else {
      setNewTechCategories([...newTechCategories, cat]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম/ফোন দিয়ে খুঁজুন..."
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          <Select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-40 text-xs sm:text-sm"
          >
            <option value="">সব এলাকা</option>
            <option value="Uttara">উত্তরা</option>
            <option value="Dhanmondi">ধানমন্ডি</option>
            <option value="Gulshan">গুলশান</option>
            <option value="Mirpur">মিরপুর</option>
            <option value="Mohammadpur">মোহাম্মদপুর</option>
          </Select>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand hover:bg-brand-dark w-full sm:w-auto gap-2"
        >
          <UserPlus className="w-4 h-4" />
          নতুন কারিগর যুক্ত করুন
        </Button>
      </div>

      {/* Technicians Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
            টেকনিশিয়ান ডাটা লোড হচ্ছে...
          </div>
        ) : !filteredTechnicians || filteredTechnicians.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            কোনো কারিগর খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold">নাম ও ফোন</TableHead>
                <TableHead className="font-bold">ক্যাটাগরি</TableHead>
                <TableHead className="font-bold">এলাকা</TableHead>
                <TableHead className="font-bold">রেটিং ও জব</TableHead>
                <TableHead className="font-bold">স্ট্যাটাস</TableHead>
                <TableHead className="font-bold text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((tech) => (
                <TableRow key={tech._id?.toString()}>
                  <TableCell>
                    <div>
                      <div className="font-bold text-gray-900">{tech.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{tech.phone}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tech.category?.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-[10px] bg-slate-50">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="font-medium text-gray-700">
                    {tech.area}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {tech.rating} ({tech.totalJobsCompleted} টি সম্পন্ন)
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={tech.isAvailable ? "default" : "secondary"}
                      className={tech.isAvailable ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"}
                    >
                      {tech.isAvailable ? "Available" : "Busy/Offline"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleMutation.mutate({
                          id: tech._id?.toString()!,
                          isAvailable: !tech.isAvailable,
                        })
                      }
                      disabled={toggleMutation.isPending}
                      className="text-xs gap-1"
                    >
                      {tech.isAvailable ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          অফলাইন করুন
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          অনলাইন করুন
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Technician Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-brand">
              নতুন টেকনিশিয়ান যুক্ত করুন
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddTechnician} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                কারিগর নাম *
              </label>
              <Input
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                placeholder="যেমন: করিম হোসেন"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ফোন নম্বর *
              </label>
              <Input
                value={newTechPhone}
                onChange={(e) => setNewTechPhone(e.target.value)}
                placeholder="01800000000"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                এনআইডি (NID) নম্বর *
              </label>
              <Input
                value={newTechNid}
                onChange={(e) => setNewTechNid(e.target.value)}
                placeholder="1990123456789"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                কার্যক্রম এলাকা *
              </label>
              <Select
                value={newTechArea}
                onChange={(e) => setNewTechArea(e.target.value)}
              >
                <option value="Uttara">উত্তরা</option>
                <option value="Dhanmondi">ধানমন্ডি</option>
                <option value="Gulshan">গুলশান</option>
                <option value="Mirpur">মিরপুর</option>
                <option value="Mohammadpur">মোহাম্মদপুর</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                সার্ভিস ক্যাটাগরি (একাধিক চয়নযোগ্য)
              </label>
              <div className="flex flex-wrap gap-4 text-xs pt-1">
                {["Electrical", "Plumbing", "AC Repair"].map((cat) => (
                  <label key={cat} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTechCategories.includes(cat)}
                      onChange={() => handleCategoryCheckbox(cat)}
                      className="rounded text-brand"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={createTechMutation.isPending} className="bg-brand hover:bg-brand-dark">
                {createTechMutation.isPending ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
};
