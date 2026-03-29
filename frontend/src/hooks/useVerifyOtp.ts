import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface VerifyOtpData {
  otpRequested: string;
  otp: string;
  newPassword: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpData>({
    mutationFn: async (payload) => {
      const res = await axios.post<VerifyOtpResponse>(
        `${API_BASE_URL}/otp/verify`,
        payload,
      );
      return res.data;
    },
  });
};

export default useVerifyOtp;
