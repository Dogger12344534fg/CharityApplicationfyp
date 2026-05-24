import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
  next?: string;
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

const EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.com$/;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (payload) => {

      if (!payload.email || !payload.password) {
        throw new Error("All fields are required.");
      }

      if (!EMAIL_REGEX.test(payload.email)) {
        throw new Error("Please enter a valid email address ending with .com");
      }

      if (payload.password.trim().length === 0) {
        throw new Error("Password is required.");
      }

      const res = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        {
          email: payload.email.toLowerCase().trim(), 
          password: payload.password,
        },
      );
      return res.data;
    },

    onSuccess: (data, variables) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("User", JSON.stringify(data.data));

      toast.success(data.message);

      if (variables.next) {
        router.replace(variables.next);
      } else if (data.data.role === "admin") {
        router.replace("/admin/");
      } else {
        router.replace("/");
      }
    },

    onError: (error) => {
      let message = "Login failed";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    },
  });
};

export default useLogin;