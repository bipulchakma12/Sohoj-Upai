import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { ITechnician } from "@/types";

export const useTechnicians = (area?: string) => {
  return useQuery({
    queryKey: ["technicians", area],
    queryFn: async () => {
      const url = area ? `/api/technicians?area=${encodeURIComponent(area)}` : "/api/technicians";
      const response = await apiClient.get(url);
      return response.data.technicians as ITechnician[];
    },
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTech: {
      name: string;
      phone: string;
      nidNumber: string;
      category: string[];
      area: string;
      isAvailable?: boolean;
      profileImage?: string;
    }) => {
      const response = await apiClient.post("/api/technicians", newTech);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};

export const useToggleTechnicianAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable?: boolean }) => {
      const response = await apiClient.patch(`/api/technicians/${id}`, { isAvailable });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
};
