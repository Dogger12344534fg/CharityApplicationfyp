// const User = require("../models/User");

// const createUser = async (userData) => {
//   const { name, email, password } = userData;

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     throw new Error("User already exists");
//   }

//   const user = await User.create({ name, email, password });
//   return user;
// };

// const authenticateUser = async (email, password) => {
//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     return user;
//   } else {
//     throw new Error("Invalid email or password");
//   }
// };

// const getAllUsers = async () => {
//   return await User.find({});
// };

// module.exports = {
//   createUser,
//   authenticateUser,
//   getAllUsers,
// };