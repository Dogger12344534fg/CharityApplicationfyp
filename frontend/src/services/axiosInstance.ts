import axios from "axios";

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
				localStorage.removeItem("token");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);
