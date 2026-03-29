import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface GenerateOtpData {
  email: string;
}

interface GenerateOtpResponse {
  success: boolean;
  message: string;
  otpRequested: string;
  userId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useGenerateOtp = () => {
  return useMutation<GenerateOtpResponse, Error, GenerateOtpData>({
    mutationFn: async (payload) => {
      const res = await axios.post<GenerateOtpResponse>(
        `${API_BASE_URL}/otp/generate`,
        payload,
      );
      return res.data;
    },
  });
};

export default useGenerateOtp;
