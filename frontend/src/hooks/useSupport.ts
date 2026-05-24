import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/axiosInstance";
import { toast } from "sonner";

export interface SupportTicket {
  _id: string;
  type: "contact" | "report";
  name: string;
  email: string;
  subject: string;
  message: string;
  campaignUrl?: string;
  status: "open" | "resolved";
  replyMessage?: string;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubmitTicketPayload {
  type: "contact" | "report";
  name?: string;
  email: string;
  subject: string;
  message: string;
  campaignUrl?: string;
}

export const useSubmitTicket = () => {
  return useMutation({
    mutationFn: async (data: SubmitTicketPayload) => {
      const response = await axiosInstance.post("/support", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Your message has been sent successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit message");
    },
  });
};

export const useGetAllTickets = (params?: any) => {
  return useQuery({
    queryKey: ["support-tickets", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/support", { params });
      return data.data;
    },
  });
};

export const useReplyToTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, replyMessage }: { id: string; replyMessage: string }) => {
      const response = await axiosInstance.patch(`/support/${id}/reply`, { replyMessage });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Reply sent successfully");
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send reply");
    },
  });
};
