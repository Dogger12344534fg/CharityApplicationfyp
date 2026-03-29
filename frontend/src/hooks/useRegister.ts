import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (payload) => {
      const res = await axios.post<RegisterResponse>(
        `${API_BASE_URL}/auth/register`,
        payload,
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Account created! Please sign in.");
      router.replace("/login");
    },

    onError: (error) => {
      let message = "Registration failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });
};

export default useRegister;
