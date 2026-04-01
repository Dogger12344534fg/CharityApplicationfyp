import Category from "./category.model.js";

export const createCategory = async ({ name, description, createdBy }) => {
  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    throw new Error("Category with this name already exists.");
  }
  const category = await Category.create({ name, description, createdBy });
  return category;
};

export const getAllCategories = async ({ page = 1, limit = 10, status, search } = {}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Category.countDocuments(query),
  ]);

  return {
    categories,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id).populate("createdBy", "name email");
  if (!category) {
    throw new Error("Category not found.");
  }
  return category;
};

export const updateCategory = async (id, { name, description, status }) => {
  // If name is being updated, check for duplicates
  if (name) {
    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      throw new Error("Category with this name already exists.");
    }
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description, status },
    { new: true, runValidators: true }
  ).populate("createdBy", "name email");

  if (!category) {
    throw new Error("Category not found.");
  }
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error("Category not found.");
  }
  return category;
};
