import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { IBooking, BookingStatus } from "@/types";

export const useBookings = (status?: string) => {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: async () => {
      const url = status ? `/api/bookings?status=${status}` : "/api/bookings";
      const response = await apiClient.get(url);
      return response.data.bookings as IBooking[];
    },
  });
};

export const useSingleBooking = (id: string, pollingInterval: number | false = 5000) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(`/api/bookings/${id}`);
      return response.data.booking as IBooking;
    },
    enabled: Boolean(id),
    refetchInterval: pollingInterval,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBooking: {
      user: string;
      serviceCategory: string;
      issueDescription: string;
      issueImage?: string;
      location: { address: string; landmark?: string; area: string };
      totalCost?: number;
    }) => {
      const response = await apiClient.post("/api/bookings", newBooking);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useAssignTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, technicianId }: { bookingId: string; technicianId: string }) => {
      const response = await apiClient.patch(`/api/bookings/${bookingId}/assign`, { technicianId });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      const response = await apiClient.patch(`/api/bookings/${bookingId}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
    },
  });
};
