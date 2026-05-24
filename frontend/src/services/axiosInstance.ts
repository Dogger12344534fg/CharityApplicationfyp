import axios from "axios";
import { Bounce, toast } from "react-toastify";

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	if (config.data instanceof FormData) {
		delete config.headers["Content-Type"];
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			console.warn("Unauthorized! Redirecting to login...");

			if (typeof window !== "undefined") {
				const message = error.response?.data?.message || "Something went wrong";
				toast.error(message, {
					toastId: "unauthorized",
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: true,
					closeOnClick: false,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
					transition: Bounce,
				});

				localStorage.removeItem("token");

				setTimeout(() => {
					window.location.href = "/login";
				}, 2000);
			}
		}
		return Promise.reject(error);
	},
);
