// // models/ProductModel.js

// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   rating: {
//     type: Number,
//     min: 1,
//     max: 5,
//     required: true,
//   },
//   comment: {
//     type: String,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     category: {
//       type: String,
//       required: true,
//       enum: ["men", "women", "kids", "electronics", "other"],
//     },

//     brand: {
//       type: String,
//       trim: true,
//     },

//     stock: {
//       type: Number,
//       default: 0,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     reviews: [reviewSchema],

//     averageRating: {
//       type: Number,
//       default: 0,
//     },

//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Method
// productSchema.methods.isInStock = function () {
//   return this.stock > 0;
// };

// module.exports = mongoose.model("Product", productSchema);