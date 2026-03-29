import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { axiosInstance } from "../services/axiosInstance";

export type CategoryStatus = "active" | "inactive";

export interface Category {
	_id: string;
	name: string;
	description?: string;
	status: CategoryStatus;
	createdAt: string;
}

export interface Pagination {
	total: number;
	page: number;
	totalPages: number;
}

interface CategoryListResponse {
	success: boolean;
	message: string;
	data: Category[];
	pagination: Pagination;
}

interface CategoryResponse {
	success: boolean;
	message: string;
	data: Category;
}

export interface GetCategoriesParams {
	page?: number;
	limit?: number;
	status?: CategoryStatus;
	search?: string;
}

export interface CreateCategoryPayload {
	name: string;
	description?: string;
}

export interface UpdateCategoryPayload extends CreateCategoryPayload {
	id: string;
	status: CategoryStatus;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
	if (axios.isAxiosError(error)) {
		return error.response?.data?.message || fallback;
	}
	return fallback;
};

export const useGetCategories = (params?: GetCategoriesParams) => {
	return useQuery<CategoryListResponse, Error>({
		queryKey: ["categories", params],
		queryFn: async () => {
			const res = await axiosInstance.get<CategoryListResponse>("/categories", {
				params,
			});
			return res.data;
		},
		staleTime: 1000 * 60 * 10, // cache for 10 minutes
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<CategoryResponse, Error, CreateCategoryPayload>({
		mutationFn: async (payload) => {
			const res = await axiosInstance.post<CategoryResponse>("/categories", payload);
			return res.data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Category created successfully.");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to create category."));
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<CategoryResponse, Error, UpdateCategoryPayload>({
		mutationFn: async ({ id, ...payload }) => {
			const res = await axiosInstance.put<CategoryResponse>(`/categories/${id}`, payload);
			return res.data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Category updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to update category."));
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<{ success: boolean; message: string }, Error, string>({
		mutationFn: async (id) => {
			const res = await axiosInstance.delete<{ success: boolean; message: string }>(`/categories/${id}`);
			return res.data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Category deleted successfully.");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to delete category."));
		},
	});
};