// // models/OrderModel.js

// const mongoose = require("mongoose");

// const orderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },

//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },

//   price: {
//     type: Number,
//     required: true,
//   },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     items: [orderItemSchema],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["esewa", "khalti", "card", "cash"],
//       default: "cash",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },

//     orderStatus: {
//       type: String,
//       enum: ["processing", "shipped", "delivered", "cancelled"],
//       default: "processing",
//     },

//     shippingAddress: {
//       street: String,
//       city: String,
//       state: String,
//       postalCode: String,
//       country: String,
//     },

//     deliveredAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Static function
// orderSchema.statics.findUserOrders = function (userId) {
//   return this.find({ user: userId }).populate("items.product");
// };

// module.exports = mongoose.model("Order", orderSchema);