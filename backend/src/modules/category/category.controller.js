import { StatusCodes } from "http-status-codes";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

// POST /api/categories
export const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const category = await createCategory({
      name,
      description,
      createdBy: req.user?.id,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    if (error.message === "Category with this name already exists.") {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// GET /api/categories
export const getAll = async (req, res) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await getAllCategories({ page, limit, status, search });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Categories fetched successfully.",
      data: result.categories,
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// GET /api/categories/:id
export const getById = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Category fetched successfully.",
      data: category,
    });
  } catch (error) {
    if (error.message === "Category not found.") {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// PUT /api/categories/:id
export const update = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const category = await updateCategory(req.params.id, { name, description, status });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    if (error.message === "Category not found.") {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Category with this name already exists.") {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// DELETE /api/categories/:id
export const remove = async (req, res) => {
  try {
    await deleteCategory(req.params.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    if (error.message === "Category not found.") {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
