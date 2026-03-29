import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (payload) => {
      const res = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        payload,
      );
      return res.data;
    },

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("User", JSON.stringify(data.data));

      if (data.data.role === "admin") {
        router.replace("/admin/");
      } else {
        router.replace("/");
      }

      toast.success(data.message);
    },

    onError: (error) => {
      let message = "Login failed";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
    },
  });
};

export default useLogin;
