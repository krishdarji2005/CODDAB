// src/services/auth.service.js – Database operations for authentication
import { User } from '../models/User.js';


export async function getUserByEmail(email) {
  return await User.findOne({ email });
}
export const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

export async function createUser(name, email, hashedPassword) {
  return await User.create({
    name,
    email,
    password: hashedPassword,
  });
}
