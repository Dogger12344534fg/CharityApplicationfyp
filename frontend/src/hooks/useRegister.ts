import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const EMAIL_REGEX =
  /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.com$/;

const validateName = (name: string): string | null => {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 50) return "Name must not exceed 50 characters.";
  if (/\d/.test(trimmed)) return "Name must not contain numbers.";
  if (trimmed.length > 1 && !/^[a-zA-Z][a-zA-Z\s'-]*[a-zA-Z]$/.test(trimmed))
    return "Name can only contain letters, spaces, hyphens, or apostrophes.";
  if (/\s{2,}/.test(trimmed))
    return "Name must not contain consecutive spaces.";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 32) return "Password must not exceed 32 characters.";
  if (/\s/.test(password)) return "Password must not contain spaces.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  if (!/[@$!%*?&_#^()\-+=]/.test(password))
    return "Password must contain at least one special character (@$!%*?&_#^()-+=).";
  return null;
};


interface GenerateOtpData {
  email: string;
}
interface GenerateOtpResponse {
  success: boolean;
  message: string;
  otpId: string;
}

export const useGenerateRegisterOtp = () => {
  return useMutation<GenerateOtpResponse, Error, GenerateOtpData>({
    mutationFn: async ({ email }) => {
      if (!EMAIL_REGEX.test(email)) {
        throw new Error(
          "Please enter a valid email address ending with .com",
        );
      }

      const res = await axios.post<GenerateOtpResponse>(
        `${API_BASE_URL}/otp/generate-email`,
        { email: email.toLowerCase().trim() },
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent! Check your email.");
    },
    onError: (error) => {
      let message = "Failed to send OTP";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};

interface RegisterData {
  name: string;
  email: string;
  otp: string;
  otpId: string;
  password: string;
  confirmPassword: string;
  inviteToken?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  joinedTeamId?: string | null;
  data: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (payload) => {

      if (
        !payload.name ||
        !payload.email ||
        !payload.otp ||
        !payload.otpId ||
        !payload.password ||
        !payload.confirmPassword
      ) {
        throw new Error("All fields are required.");
      }

      const nameError = validateName(payload.name);
      if (nameError) throw new Error(nameError);

      if (!EMAIL_REGEX.test(payload.email)) {
        throw new Error(
          "Please enter a valid email address ending with .com",
        );
      }

      const passwordError = validatePassword(payload.password);
      if (passwordError) throw new Error(passwordError);

      if (payload.password !== payload.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      if (!/^\d{6}$/.test(payload.otp.toString().trim())) {
        throw new Error("OTP must be exactly 6 digits.");
      }

      const res = await axios.post<RegisterResponse>(
        `${API_BASE_URL}/auth/register`,
        {
          ...payload,
          name: payload.name.trim(),
          email: payload.email.toLowerCase().trim(),
          otp: payload.otp.trim(),
        },
      );
      return res.data;
    },

    onSuccess: (data, variables) => {
      if (variables.inviteToken && data.joinedTeamId) {
        toast.success("Account created! You've been added to the team.");
        router.replace(`/teams/${data.joinedTeamId}`);
      } else if (variables.inviteToken) {
        toast.success(data.message || "Account created! Please sign in to accept your invite.");
        router.replace(`/login?next=/teams/invite/${variables.inviteToken}`);
      } else {
        toast.success(data.message || "Account created! Please sign in.");
        router.replace("/login");
      }
    },

    onError: (error) => {
      let message = "Registration failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    },
  });
};

export default useRegister;