// // models/UserModel.js

// const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema(
//   {
//     street: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     state: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     zipCode: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     country: {
//       type: String,
//       default: "Nepal",
//     },
//   },
//   { _id: false }
// );

// const orderSchema = new mongoose.Schema(
//   {
//     productName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     orderedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { _id: false }
// );

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 50,
//     },

//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 50,
//     },

//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     age: {
//       type: Number,
//       min: 18,
//       max: 100,
//     },

//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin", "seller"],
//       default: "user",
//     },

//     profileImage: {
//       type: String,
//       default: "",
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },

//     address: addressSchema,

//     wishlist: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],

//     orders: [orderSchema],

//     lastLogin: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Virtual field
// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Instance method
// userSchema.methods.getPublicProfile = function () {
//   return {
//     id: this._id,
//     fullName: this.fullName,
//     username: this.username,
//     email: this.email,
//     role: this.role,
//   };
// };

// // Static method
// userSchema.statics.findByEmail = function (email) {
//   return this.findOne({ email });
// };

// module.exports = mongoose.model("User", userSchema);