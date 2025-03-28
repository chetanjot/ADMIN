const Category = require("../../models/category/category");
const mongoose = require("mongoose");
const response = require("../../responsesHandler/response_handler");
const { messages } = require("../../core/constants/server_messages");

exports.addCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const newCategory = new Category({ name, description, image });
    const categoryAdded = await newCategory.save();

    if (!categoryAdded) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].categoryNotAdded,
        data: {},
      });
    }
    return response.okHttpResponse({
      response: res,
      message: messages[req.language].categoryAdded,
      data: categoryAdded || {},
    });
  } catch (error) {
    console.error("Error during add category", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].categoryNotFound,
        data: {},
      });
    }

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].categoryDeleted,
      data: {},
    });
  } catch (error) {
    console.error("Error during delete category", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
exports.categoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].categoryNotFound,
        data: {},
      });
    }

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].categoryFound,
      data: category,
    });
  } catch (error) {
    console.error("Error during delete category", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
exports.categories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const category = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCategories = await Category.countDocuments(query);

    if (!category.length) {
      return response.badHttpResponse({
        response: res,
        message: messages[req.language].categoryNotFound,
        data: {},
      });
    }

    return response.okHttpResponse({
      response: res,
      message: messages[req.language].categoryFound,
      data:
        {
         data: category,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCategories / limit),
            totalItems: totalCategories,
          },
        } || [],
    });
  } catch (error) {
    console.error("Error during delete category", error);
    return response.serverHttpResponse({
      response: res,
      message: error.message,
    });
  }
};
